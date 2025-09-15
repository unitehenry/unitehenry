+++
title = "Domain-Driven Test Pipelines"
date = "2025-09-13"
description = "Parallelizing tests by domain with matrix strategies."
tags = []
+++

When building CI pipelines, a [matrix strategy](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/run-job-variations) is a configuration setup that allows a CI system to run multiple tests or build jobs in parallel with different combinations of parameters. For example, building by operating systems, programming language versions, or environment settings. Typically these are used to run tests against multiple environments and versions of software. For example, running python tests across different versions of python on different operating systems.

```yaml
jobs:
  example_matrix:
    strategy:
      matrix:
        python_version: [10, 12, 14]
        os: [ubuntu-latest, windows-latest]
```

In theory, a domain-driven project will have their tests logically divided into these groupings as well.

```plaintext
com/example/api/
├── src/
│   ├── user/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── controller/
│   ├── order/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── controller/
│   ├── shipping/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── controller/
├── test/
│   ├── user/
│   │   ├── service/
│   │   ├── controller/
│   ├── order/
│   │   ├── service/
│   │   ├── controller/
│   ├── shipping/
│   │   ├── service/
│   │   ├── controller/
```

As your codebase grows and your tests grow with it, any tests that require external dependencies may become resource constrained. For example, attempting to run parallel tests against the same instance of postgres. There are two bottlenecks that can occur in this situation:
- Limited amounts of tests can run in parallel
- Limited database connections can be opened and shared across tests

What if we leveraged the build matrix mechanism to run these tests in parallel? Each domain would run it's tests with it's own DB instance and in isolation of other domains.

## Parametrizing Test Jobs

If you're using [GitHub Actions](https://docs.github.com/en/actions), it's common to use [reusable workflows](https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows) to reuse existing snippets of steps to run your jobs. This is especially useful when parametrizing the domain of tests that we intend to run.

### Gradle Example

```yaml
# .github/workflows/test.yml

on:
  workflow_call:
    inputs:
      domain:
        required: true
        type: string

jobs:
  unit_test:
    runs-on: depot-ubuntu-22.04
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4
        with:
          ref: ${{ github.head_ref }}

      - name: Setup Java 21
        uses: actions/setup-java@v4.5.0
        with:
          distribution: 'corretto'
          java-version: '21'

      - name: Setup Gradle
        uses: gradle/actions/setup-gradle@v4
        with:
          gradle-version: '8.14.3'

      - name: Run Gradle Test
        run: ./gradlew test --tests='com.example.api.${{ inputs.domain }}.*'
```

As an example, you may have a gradle project and a CI you want run gradle tests on. Instead of running `./gradlew test` and having your whole suite of tests run asynchronously top-to-bottom, we can leverage a reusable workflow to run only a subset of tests based on domain.

## Domain Matrix

```yaml
# .github/workflows/feature

jobs:
  test:
    uses: .github/workflows/test.yml
    with:
      domain: ${{ matrix.domain }}
    strategy:
      matrix:
        domain:
            - user
            - order
            - shipping
```

Now that we have a reusable workflow for running our tests, we can use a matrix strategy and run each domains set of tests in parallel of each other.

## Enforcing Domain Test Coverage

```python
#! /usr/bin/env python

import os
import yaml

def is_domain_covered(domain, test_domains):
  for test_domain in test_domains:
    if domain in test_domain:
      return True
  return False

if __name__ == '__main__':
  with open('.github/workflows/feature.yml', 'r') as workflow_file:
    workflow = yaml.load(workflow_file, Loader=yaml.FullLoader)

    test_domains = workflow['jobs']['test']['strategy']['matrix']['domain']

    domains = os.listdir('com/example/src')

    for domain in domains:
      if not is_domain_covered(domain, test_domains):
        raise Exception(f'The {domain} domain is not covered in tests')
```

What if we introduce a new domain to our project? Surely, we want enforce that all domains are covered when we run our tests via a matrix strategy. Here's a python example of a simple bash script we can use to parse the matrix strategy yaml array and verify it covers each domain directory of our project.

```yaml
jobs:
  domain_coverage:
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4
        with:
          ref: ${{ github.head_ref }}

      - name: Verify Domain Test Coverage
        run: ./scripts/test/domain_test_coverage.sh

  test:
    needs: [ domain_coverage ]
    uses: .github/workflows/unit-test.yml
    with:
      domain: ${{ matrix.domain }}
    strategy:
      matrix:
        domain:
            - user
            - order
            - shipping
```

Now we can run this bash script before the matrix strategy job runs, to verify that all domains are covered with any incoming changes to our project.

## Omitting Irrelevant Domains Per Feature

```yaml
on:
  workflow_call:
    inputs:
      domain:
        required: true
        type: string

jobs:
  unit_test:
    runs-on: depot-ubuntu-22.04
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4
        with:
          ref: ${{ github.head_ref }}

      - name: Determine If Test Is Needed
        id: test_needed
        run: |
          git fetch origin main;

          INPUT_DOMAIN=$(echo '${{ inputs.domain }}' | cut -f 1 -d '.' -)

          if [ $(git diff origin/main --name-only | grep $INPUT_DOMAIN | wc | awk '{ print $1 }') -ne 0 ]; then
            echo "is-test-needed=true" >> "$GITHUB_OUTPUT";
          else
            # Run all tests when merged to main
            if [ $(git branch --show-current) == 'main' ]; then
              echo "is-test-needed=true" >> "$GITHUB_OUTPUT";
            else
              echo "is-test-needed=false" >> "$GITHUB_OUTPUT";
            fi
          fi

      - name: Setup Java 21
        if: steps.test_needed.outputs.is-test-needed == 'true'
        uses: actions/setup-java@v4.5.0
        with:
          distribution: 'corretto'
          java-version: '21'

      - name: Setup Gradle
        if: steps.test_needed.outputs.is-test-needed == 'true'
        uses: gradle/actions/setup-gradle@v4
        with:
          gradle-version: '8.14.3'

      - name: Run Gradle Test
        if: steps.test_needed.outputs.is-test-needed == 'true'
        run: ./gradlew test --tests='com.example.api.${{ inputs.domain }}.*'
```

Now that we're running tests based on domain, we can conditionally run tests for features that might not impact other domains. By checking the files included in a `git diff`, we can check if the `inputs.domain` is included with the files being changed, and only then run tests as needed.

This is a great way to reduce billable CI minutes.

**Note:** You still will likely want to run all tests after the feature is merged.

## Benefits

```bash
$ gradle test --parallel
```

Given the gradle example earlier, build tools might have parallel testing mechanisms like [`--parallel`](https://docs.gradle.org/current/userguide/performance.html#sec:enable_parallel_execution). These very well may work out of the box for different projects, but some issues I've encountered in the past when leveraging these mechanisms are: 
- External dependencies be constrained to run the tests in parallel
- Threads used for tests constrained by the amount of CPU cores the runners have

When parallelizing  tests by project domain, here are some of the benefits that these changes yield:
- Physical isolation of resources and domains per set of tests, reducing resource constraints like database connections
- Run more tests in parallel, reducing the time it takes for developers to get feedback on their features
- Less tests ran on a per feature basis, reducing billable CI minutes

+++
title = "What's in My RC 2022"
date = "2022-12-19"
+++

Welcome to a tour of my `.zshrc` file! I thought it would be fun to take a dive into the different tools I use to elevate my developer game.

If you want to see my whole config, I keep all my setup files on GitHub: [https://github.com/unitehenry/config](https://github.com/unitehenry/config)

Also check out last years: [What's in my RC 2021](/blog/whats-in-my-rc-2021)

# The Variables

```
# EDITOR
export EDITOR="vi";
export VISUAL="vi";

# iCloud Directory
export DOCS="/Users/$(whoami)/Library/Mobile Documents/com~apple~CloudDocs";

# Work Directory
export WORK="/Users/$(whoami)/Projects/lula";

# Vault Address
export VAULT_ADDR=https://vault.stallions.dev/
```

*   Continuing to use vim, so just exporting my preferred editor variables
*   Reference my iCloud directory which I use to keep all my personal files
*   Adding an environment variable to help reference [where my company is storing secrets](https://www.vaultproject.io/)

# Credentials

```
# Credentials Fetcher
function op-create() {
  op item template get Login > /tmp/login.json;
  if [ -n "$3" ]
  then
    echo $(cat /tmp/login.json | jq -r -c "(.fields[] | select(.id | contains(\"username\"))) .value = \"$2\"") > /tmp/login.json;
    echo $(cat /tmp/login.json | jq -r -c "(.fields[] | select(.id | contains(\"password\"))) .value = \"$3\"") > /tmp/login.json;
    op item create --template /tmp/login.json --title $1;
  else
    echo $(cat /tmp/login.json | jq -r -c "(.fields[] | select(.id | contains(\"username\"))) .value = \"$2\"") > /tmp/login.json;
    op item create --template /tmp/login.json --title $1 --generate-password;
  fi
  rm /tmp/login.json;
}

function op-list() {
  op item list --format=json | jq -c -r '.[].title';
}

function op-username() {
 op item get $@ --format=json | jq -c -r '.fields[] | select(.id | contains("username")) | .value';
}

function op-password() {
  op item get $@ --format=json | jq -c -r '.fields[] | select(.id | contains("password")) | .value';
}

function op-delete() {
  op item delete $@;
}
```

I used to be anti hosted password managers, but I was recommended using 1password and their [CLI client](https://developer.1password.com/docs/cli) to manage my passwords.

# Code Formatter

```
## Code Formatter
function format-file() {
  export FILENAME="$(basename $@)";
  export EXTENSION="${FILENAME##*.}";

  if [ $EXTENSION = 'py' ]
  then
    yapf --in-place $@;
    return 0;
  fi

  if [ $EXTENSION = 'php' ]
  then
    php-cs-fixer fix $@;
    rm .php_cs.cache;
    return 0;
  fi

  if [ $EXTENSION = 'sql' ]
  then
    npx sql-formatter-cli --file $@ --out $@;
    return 0;
  fi

  npx prettier --write --single-quote $@;

  unset FILENAME; unset EXTENSION;
}
```

Using the same code formatter, but added something to handle `sql` files now!

# Spell Check

```
## Spellcheck
function spellcheck-file() {
  npx spellchecker-cli --files $@;
}
```

Handy spellchecker utility through `npx` is always useful.

# What the Commit

```
## What the Commit
function wtf() { git commit -am "$(curl http://whatthecommit.com/index.txt)"; }
```

For when I don't know what to type in for a commit message.

# Cheat Sheet

```
Cheat Sheet
## Cheat
function cheat(){ curl https://cheat.sh/"$@"; }
```

When I don't remember how to use a certain utility, this [cheatsheet API](https://cheat.sh/) is always handy.

# Git

```
## Commit Count
function commit-count() {
  if [ -n "$1" ]
  then
    git rev-list --count $1;
  else
    echo "commit-count <branch-name>";
  fi
}

Not as useful, but interesting. I use this to get the number of commits on my current working branch.
```

# Document Generation

```
## Generate Markdown
function generate-doc() { 
  cp -rf . /tmp;
  if [ -n "$2" ]
  then
    pandoc -s $1 -c $2 -o "/tmp/$1.html";
  else
    pandoc -s $1 -o "/tmp/$1.html"; 
  fi
  open "/tmp/$1.html";
}

## Generate Slide
function generate-slide() {
  # https://revealjs.com/config/
  pandoc -t revealjs \
    -V controls="false" \
    -V progress="false" \
    -V navigationMode="linear" \
    -V transition="none" \
    -s $1 -o "/tmp/$1.html";
  cp -rf . /tmp;
  open "/tmp/$1.html";
}

function mmdc() {
  npx @mermaid-js/mermaid-cli $@;
}
```

Continuing to leverage [pandoc](https://pandoc.org/) whenever I need to create some quick slides or a document.

# Homebrew Install

```
## Homebrew Install Script
function install-homebrew() { /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"; }
```

Handy script to install [homebrew](https://brew.sh) on a new machine.

# Vundle Install

```
## Vundle Install Script
function install-vundle() {
  git clone https://github.com/VundleVim/Vundle.vim.git ~/.vim/bundle/Vundle.vim;
  sudo gem install vundle-cli;
  if ! grep -Fxq 'set rtp+=~/.vim/bundle/Vundle.vim' ~/.vimrc
  then
    echo "\nset nocompatible\nfiletype off\nset rtp+=~/.vim/bundle/Vundle.vim\ncall vundle#begin()\n\nPlugin 'VundleVim/Vundle.vim'\n\ncall vundle#end()\nfiletype plugin indent on" >> ~/.vimrc;
  fi
}
```

I use [vundle](https://github.com/VundleVim/Vundle.vim) to manage my vim packages. But this [handy cli](https://github.com/baopham/vundle-cli) makes installing/removing those packages much easier.

# Docker

```
function clear-docker() {
  docker system prune -a -f --volumes
}

function kill-docker() {
  killall Docker && open /Applications/Docker.app;
}
```

For when I just want to wipe docker of all images, containers, and volumes.

Also something to help restart the docker daemon.

# Google Cloud Platform

```
function gcloud-adc() {
  gcloud auth login --update-adc
}

function use-gcloud-project () {
  gcloud config set project "$1";
}

function impersonate() {
    if [ -z "$1" ]; then
        echo "Must provide a service account to impersonate."
        return 1
    fi
    gcloud config set auth/impersonate_service_account "$1"
}

function unimpersonate() {
    gcloud config unset auth/impersonate_service_account
}

function connect() {
    # Set the context
    CONTEXT=${1}

    export PGUSER=$(vault kv get -field=username secrets/${CONTEXT}/postgres-terraform)
    export PGPASSWORD=$(vault kv get -field=password "secrets/${CONTEXT}/postgres-terraform")
    psql -h 127.0.0.1 -p 54320  -d "${CONTEXT}"
}
```

*   Logging into [Google ADC](https://cloud.google.com/docs/authentication/provide-credentials-adc)
*   Setting GCP project to work with
*   [Service account impersonation](https://cloud.google.com/iam/docs/impersonating-service-accounts)
*   Connect to [cloud sql](https://cloud.google.com/sql)

# Vault

```
function vs() {
    # Verify inputs
    environment="$1"
    if [ "$environment" != "common" ] && [ "$environment" != "staging" ] && [ "$environment" != "production" ]; then
        echo "\"$environment\" is not a valid environment."
        return 1
    fi

    # Setup
    [ ! -d ~/.vault-tokens ] && mkdir ~/.vault-tokens

    # Move the current environment's token to the correct location
    if [ -f ~/.vault-tokens/current-environment ] && [ -f ~/.vault-token ]; then
        current="$(cat ~/.vault-tokens/current-environment)"
        cp ~/.vault-token ~/.vault-tokens/${current}
    fi

    # Set the new current environment
    echo "${environment}" > ~/.vault-tokens/current-environment

    # Set the correct vault address
    if [ "$environment" = "common" ]; then
        export VAULT_ADDR="https://vault.stallions.dev"
    else
        export VAULT_ADDR="https://vault.${environment}.stallions.dev"
    fi

    # Get the token from the current environment if it exist
    if [ -f ~/.vault-tokens/${environment} ] ; then
        cp ~/.vault-tokens/${environment} ~/.vault-token
    fi

    # Prompt login if the token is not valid
    if ! vault token lookup > /dev/null; then
        vault login --method oidc
    fi
}
```

This script helps me switch [vault](https://www.vaultproject.io/) contexts for pulling secrets in different environments like staging and production.

# Generate ID

```
function uuid() {
    uuidgen | tr '[:upper:]' '[:lower:]'
}

function vin() {
  echo "$(curl -sS https://randomvin.com/getvin.php\?type\=fake | tr -d '[:space:]')"
}
```

I use this to create new uuids and new [vin numbers](https://en.wikipedia.org/wiki/Vehicle_identification_number).

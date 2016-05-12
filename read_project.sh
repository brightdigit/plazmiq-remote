#!/bin/bash

git_repo_url=$(cat .credentials/project.json | jsawk "return this.repository.url")
git_repo_username=$(cat .credentials/project.json | jsawk "return this.repository.authentication.credentials.username")
git_repo_password=$(cat .credentials/project.json | jsawk "return this.repository.authentication.credentials.password")

git_repo_url_proto="$(echo $git_repo_url | grep :// | sed -e's,^\(.*://\).*,\1,g')"

# remove the protocol -- updated
git_repo_url_url=$(echo $git_repo_url | sed -e s,$git_repo_url_proto,,g)

# extract the user (if any)
git_repo_url_user="$(echo $url | grep @ | cut -d@ -f1)"

# extract the host -- updated
git_repo_url_host=$(echo $url | sed -e s,$user@,,g | cut -d/ -f1)

# extract the path (if any)
git_repo_url_path="$(echo $url | grep / | cut -d/ -f2-)"

echo "$git_repo_url_proto$git_repo_username:$git_repo_password@$git_repo_url_url"
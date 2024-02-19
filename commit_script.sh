#!/bin/bash

start_date="2024-02-19 10:10:00"
end_date="2024-03-02 10:10:00"

current_date="$start_date"

while [[ $(date -d "$current_date" +%s) -le $(date -d "$end_date" +%s) ]]; do
    commit_date=$(date -d "$current_date" +"%a %d %b %Y %T KST")
    commit_message="[$(date -d "$current_date" +"%Y.%m.%d")] 커밋 메세지"
    git commit --date "$commit_date" -m "$commit_message"
    current_date=$(date -d "$current_date + 1 day" +"%Y-%m-%d %T")
done
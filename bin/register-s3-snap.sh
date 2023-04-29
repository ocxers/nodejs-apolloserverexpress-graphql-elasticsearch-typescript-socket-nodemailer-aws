#!/usr/bin/env bash

echo "==> Register a repository ..."
curl -X PUT "http://localhost:9200/_snapshot/backup_for_s3" -H 'Content-Type: application/json' -d'
 {
   "type": "s3",
   "settings": {
     "bucket": "__ocxers__",
     "base_path": "",
     "region": "us-east-1",
     "access_key": "__ocxers__",
     "secret_key": "__ocxers__",
     "max_retries": 3
   }
 }'

echo "==> Set up a snapshot policy ..."
curl -X PUT "http://localhost:9200/_slm/policy/nightly-snapshots" -H 'Content-Type: application/json' -d'
 {
  "schedule": "0 0 3 * * ?",
  "name": "<nightly-snap-{now/d}>",
  "repository": "backup_for_s3",
  "config": {
    "indices": ["*"]
  },
  "retention": {
    "expire_after": "30d",
    "min_count": 7,
    "max_count": 31
  }
}'


# curl -X POST "http://localhost:9000/_slm/policy/nightly-snapshots/_execute"

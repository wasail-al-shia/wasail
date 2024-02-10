#!/bin/bash

# exit script if env variables not set
set -o nounset

data_dir="/tmp/"

table_names="book section chapter report text comment feedback tag article article_to_report"

src_host=${WASAIL_DB_HOST}
src_port="5432"
src_database="wasail-db"
src_username="postgres"
src_password=${WASAIL_DB_PWD}

tgt_host="localhost"
tgt_port="5433"
tgt_database="wasail_dev"
tgt_username="postgres"
tgt_password="postgres"


for table_name in ${table_names}
do
  echo ""
  echo "EXTRACTING table: ${table_name}"
  # Add --verbose if needed to debug.
  PGPASSWORD=${src_password} pg_dump --data-only --file "${data_dir}/${table_name}.sql" --host ${src_host} --port ${src_port} --username ${src_username} --no-password --format=p --blobs --table ${table_name} --dbname ${src_database}
  if [[ $? -ne 0 ]]; then
    echo "FAILED to extract data for ${table_name}. Exiting..."
    exit 6
  fi

  echo "POPULATING table: ${table_name}"
  # Add --verbose if needed to debug.
  PGPASSWORD=${tgt_password} psql  --host ${tgt_host} --port ${tgt_port}  --username ${tgt_username} --no-password --dbname ${tgt_database} --file="${data_dir}/${table_name}.sql"
  if [[ $? -ne 0 ]]; then
    echo "FAILED to populate data for ${table_name}. Exiting..."
    exit 7
  fi
  echo "---------------------------------------------"
done
echo ""
echo "FINISHED copying tables"

defmodule Wasail.Repo.Migrations.AddActivity do
  use Ecto.Migration

  def up do
    create table(:ip_info) do
      add :ip, :string, null: false
      add :country, :string
      add :region, :string
      add :city, :string
      timestamps()
    end

    create index(:ip_info, [:ip])

    create table(:activity) do
      add :ip_info_id, references(:ip_info), null: false
      add :activity_type, :string, null: false
      add :report_id, :integer
      add :chapter_id, :integer
      add :search_str, :string
      # "view_report", "view_chapter", "search"
      add :desc, :text
      timestamps()
    end

    alter table("feedback") do
      add_if_not_exists :sender_email, :string, null: false
    end
  end

  def down do
    drop table(:activity)
    drop table(:ip_info)

    alter table("feedback") do
      remove :sender_email
    end
  end
end

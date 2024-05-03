defmodule Wasail.Repo.Migrations.EasyGuideSchema do
  use Ecto.Migration

  def up do
    create table(:easy_guide_category) do
      add :name, :string, null: false
      add :cat_seq_no, :integer, null: false
      add :description, :text, null: false
      timestamps()
    end

    create table(:easy_guide) do
      add :easy_guide_category_id, references(:easy_guide_category), null: false
      add :title, :string, null: false
      add :eg_seq_no, :integer, null: false
      timestamps()
    end

    create table(:easy_guide_fragment) do
      add :easy_guide_id, references(:easy_guide), null: false
      add :frag_seq_no, :string, null: false
      add :report_id, references(:report)
      add :html, :text
      timestamps()
    end
  end

  def down do
    drop table(:easy_guide_fragment)
    drop table(:easy_guide)
    drop table(:easy_guide_category)
  end
end

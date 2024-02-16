defmodule Wasail.Repo.Migrations.CoreTables do
  use Ecto.Migration

  def up do
    create table(:book) do
      add :name_eng, :string, null: false
      add :code, :string, null: false
      add :author_eng, :string, null: false
      add :desc_eng, :text
      add :name_arb, :string
      add :author_arb, :string
      add :desc_arb, :text
      add :volume_no, :integer, null: false
      add :library_seq_no, :integer, null: false
      add :cover_image, :bytea
      add :cover_image_mime_type, :string
      add :pdf, :bytea
      timestamps()
    end

    create table(:section) do
      add :book_id, references(:book), null: false
      add :section_no, :integer, null: false
      add :name_eng, :text, null: false
      add :name_arb, :text
      add :desc_eng, :text
      add :desc_arb, :text
      timestamps()
    end

    create unique_index(:section, [:book_id, :section_no])

    create table(:chapter) do
      add :section_id, references(:section), null: false
      add :chapter_no, :integer, null: false
      add :name_eng, :text, null: false
      add :name_arb, :text
      add :desc_eng, :text
      add :desc_arb, :text
      timestamps()
    end

    create unique_index(:chapter, [:section_id, :chapter_no])

    create table(:report) do
      add :chapter_id, references(:chapter), null: false
      add :report_no, :integer, null: false
      add :heading_eng, :text
      add :heading_arb, :text
      add :review, :boolean, default: false
      add :hide, :boolean, default: false
      add :notes, :text
      timestamps()
    end

    # create unique_index(:report, [:chapter_id, :report_no])

    create table(:text) do
      add :report_id, references(:report), null: false
      add :fragment_no, :integer, null: false
      add :text_eng, :text, null: false
      add :text_arb, :text, null: false
      timestamps()
    end

    # create unique_index(:text, [:report_id, :fragment_no])

    create table(:comment) do
      add :report_id, references(:report), null: false
      add :comment_seq_no, :integer, null: false
      add :comment_eng, :text, null: false
      add :comment_arb, :text
      timestamps()
    end

    # create unique_index(:comment, [:report_id, :comment_seq_no])

    create table(:feedback) do
      add :report_id, references(:report), null: false
      add :sender_name, :string, null: false
      add :sender_email, :string, null: false
      add :comment, :text, null: false
      add :reviewed, :boolean, default: false
      add :resolution, :text
      timestamps()
    end

    create table(:tag, primary_key: false) do
      add :report_id, references(:report), null: false
      add :tag_name, :string, primary_key: true
      timestamps()
    end

    create table(:article) do
      add :title, :string, null: false
      add :article_seq_no, :integer, null: false
      add :summary, :string
      add :article_text, :text
      timestamps()
    end

    create table(:article_to_report, primary_key: false) do
      add :article_id, references(:article), primary_key: true
      add :report_id, references(:report), primary_key: true
      add :report_seq_no, :integer, null: false
      timestamps()
    end

    execute(
      "ALTER TABLE text ADD COLUMN fts_eng tsvector GENERATED ALWAYS AS (to_tsvector('english', text_eng)) STORED"
    )

    execute("CREATE INDEX text_fts_eng_idx ON text USING GIN (fts_eng)")
  end

  def down do
    drop table(:article_to_report)
    drop table(:article)
    drop table(:tag)
    drop table(:feedback)
    drop table(:comment)
    drop table(:text)
    drop table(:report)
    drop table(:chapter)
    drop table(:section)
    drop table(:book)
  end
end

defmodule Wasail.Book do
  import Ecto.Query
  alias Wasail.Repo
  alias Wasail.Schema.{Report, Chapter, Section, Book}

  def get(id), do: Repo.get(Book, id)

  def all() do
    Book
    |> order_by(asc: :library_seq_no, asc: :volume_no)
    |> Repo.all()
    |> Repo.preload(sections: :chapters)
  end

  def percent_complete(book_id) do
    Wasail.Util.Sys.percent_complete(num_reports(book_id), book_id)
  end

  def num_reports(book_id) do
    count_reports_query =
      from(b in Book,
        join: s in Section,
        on: s.book_id == b.id,
        join: c in Chapter,
        on: c.section_id == s.id,
        join: r in Report,
        on: r.chapter_id == c.id,
        where: b.id == ^book_id,
        select: count(r.id)
      )

    Repo.one(count_reports_query)
  end

  def insert(rec) do
    %Book{}
    |> changeset(rec)
    |> Repo.insert()
  end

  def changeset(%Book{} = book, attrs \\ %{}) do
    book
    |> Ecto.Changeset.cast(attrs, [
      :name_eng,
      :code,
      :author_eng,
      :desc_eng,
      :volume_no,
      :library_seq_no
    ])
    |> Ecto.Changeset.validate_required([
      :name_eng,
      :author_eng,
      :volume_no,
      :library_seq_no
    ])
  end

  def update(id, changes = %{}) do
    id
    |> get()
    |> Ecto.Changeset.change(changes)
    |> Repo.update()
  end

  def delete(id) do
    get(id)
    |> case do
      %Book{} = b -> Repo.delete(b)
      nil -> nil
    end
  end
end

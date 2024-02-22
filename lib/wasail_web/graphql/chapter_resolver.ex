defmodule WasailWeb.Graphql.ChapterResolver do
  require Logger
  alias Wasail.Chapter, as: Chapter

  def chapters_by_section_id(%{section_id: section_id}, _info) do
    {:ok, Chapter.get_by_section_id(section_id)}
  end

  def chapter_by_id(%{chapter_id: chapter_id}, _info) do
    {:ok, Chapter.get(chapter_id)}
  end

  def add_chapter(
        %{section_id: _section_id, chapter_no: _chapter_no, name_eng: _name_eng} = params,
        _info
      ) do
    case Chapter.insert(params) do
      {:error, changeset} ->
        message = "Could not add chapter: #{inspect(error_details(changeset))}"
        Logger.error(message)
        {:error, message: message}

      {:ok, chapter} ->
        {:ok,
         %{
           status: :ok,
           message: "Added chapter #{chapter.id}, no #{chapter.chapter_no}"
         }}
    end
  end

  def update_chapter(
        %{chapter_id: chapter_id} = params,
        _info
      ) do
    # Logger.info("update chapter params: #{inspect(params)}")

    case Chapter.update(chapter_id, params) do
      {:error, changeset} ->
        message = "Could not update chapter: #{inspect(error_details(changeset))}"
        Logger.error(message)
        {:error, message: message}

      {:ok, chapter} ->
        {:ok, %{status: :ok, message: "Updated chapter with id: #{chapter.id}"}}
    end
  end

  def delete_chapter(%{chapter_id: chapter_id}, _info) do
    # Logger.info("delete chapter: #{inspect(chapter_id)}")

    case Chapter.delete(chapter_id) do
      {:ok, chapter} ->
        {:ok, %{status: :ok, message: "Deleted chapter with key #{chapter.id}"}}

      other ->
        message = "Could not delete chapter: #{inspect(other)}"
        Logger.error(message)
        {:error, message: message}
    end
  end

  def error_details(changeset) do
    changeset
    |> Ecto.Changeset.traverse_errors(fn {msg, _} -> msg end)
  end
end

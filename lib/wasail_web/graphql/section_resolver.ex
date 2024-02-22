defmodule WasailWeb.Graphql.SectionResolver do
  require Logger
  alias Wasail.Section, as: Section

  def sections_by_book_id(%{book_id: book_id}, _info) do
    {:ok, Section.all(book_id)}
  end

  def section_by_id(%{section_id: section_id}, _info) do
    {:ok, Section.get(section_id)}
  end

  def add_section(%{book_id: _book_id, section_no: _section_no} = params, _info) do
    case Section.insert(params) do
      {:error, changeset} ->
        message = "Could not create section: #{inspect(error_details(changeset))}"
        Logger.error(message)
        {:error, message: message}

      {:ok, section} ->
        {:ok,
         %{
           status: :ok,
           message: "Added section #{section.book_id}, section #{section.section_no || "n/a"}"
         }}
    end
  end

  def update_section(
        %{section_id: section_id} = params,
        _info
      ) do
    # Logger.info("update section params: #{inspect(params)}")

    case Section.update(section_id, params) do
      {:error, changeset} ->
        message = "Could not update section: #{inspect(error_details(changeset))}"
        Logger.error(message)
        {:error, message: message}

      {:ok, section} ->
        {:ok, %{status: :ok, message: "Updated section with id: #{section.id}"}}
    end
  end

  def delete_section(%{section_id: section_id}, _info) do
    # Logger.info("delete section: #{inspect(section_id)}")

    case Section.delete(section_id) do
      {:ok, section} ->
        {:ok, %{status: :ok, message: "Deleted section with id #{section.id}"}}

      other ->
        message = "Could not delete section: #{inspect(other)}"
        Logger.error(message)
        {:error, message: message}
    end
  end

  def error_details(changeset) do
    changeset
    |> Ecto.Changeset.traverse_errors(fn {msg, _} -> msg end)
  end
end

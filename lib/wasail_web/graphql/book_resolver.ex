defmodule WasailWeb.Graphql.BookResolver do
  require Logger
  alias Wasail.Book, as: Book

  def book_by_id(%{book_id: book_id}, _info) do
    {:ok, Book.get(book_id)}
  end

  def books(_args, _info) do
    {:ok, Book.all()}
  end

  def add_book(%{input: params}, _info) do
    Logger.info("add book params: #{inspect(params)}")

    case Book.insert(params) do
      {:error, changeset} ->
        message = "Could not create book: #{inspect(error_details(changeset))}"
        Logger.error(message)
        {:error, message: message}

      {:ok, book} ->
        {:ok, %{status: :ok, message: "Added book: #{book.name_eng}"}}
    end
  end

  def update_book(%{input: %{id: book_id} = params}, _info) do
    Logger.info("update book params: #{inspect(params)}")

    case Book.update(book_id, params) do
      {:error, changeset} ->
        message = "Could not update book: #{inspect(error_details(changeset))}"
        Logger.error(message)
        {:error, message: message}

      {:ok, book} ->
        {:ok, %{status: :ok, message: "Updated book with key: #{book.id}"}}
    end
  end

  def delete_book(%{book_id: id}, _info) do
    Logger.info("delete book: #{inspect(id)}")

    case Book.delete(id) do
      {:ok, book} ->
        {:ok, %{status: :ok, message: "Deleted book with key #{book.id}"}}

      other ->
        message = "Could not delete book: #{inspect(other)}"
        Logger.error(message)
        {:error, message: message}
    end
  end

  def error_details(changeset) do
    changeset
    |> Ecto.Changeset.traverse_errors(fn {msg, _} -> msg end)
  end
end

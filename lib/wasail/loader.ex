defmodule Wasail.Loader do
  require Logger

  def load_books() do
    query =
      ~s"""
      {
        books {
          name_eng
          code
          author_eng
          library_seq_no
          volume_no
        }
      }
      """

    wasail_query(query)
    |> get_in(["data", "books"])
    |> Enum.each(fn book ->
      Wasail.Book.insert(book)
    end)
  end

  def wasail_query(query) do
    url = Application.get_env(:wasail, :ws_query_url)
    Wasail.Util.Http.post(%{query: query}, url)
  end
end

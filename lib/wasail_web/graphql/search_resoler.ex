defmodule WasailWeb.Graphql.SearchResolver do
  def search(%{search_str: search_str}, _info) do
    {:ok, search_str}
  end
end

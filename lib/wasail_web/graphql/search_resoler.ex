defmodule WasailWeb.Graphql.SearchResolver do
  def search(%{query_str: query_str}, _info) do
    {:ok, query_str}
  end
end

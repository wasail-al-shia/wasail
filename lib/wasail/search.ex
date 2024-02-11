defmodule Wasail.Search do
  def search(query_str) do
    {:ok, [%{report_id: 1, matching_text: query_str}]}
  end
end

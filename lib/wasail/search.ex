defmodule Wasail.Search do
  require Logger
  import Ecto.Query
  alias Wasail.Repo

  def search2(query_str) do
    query =
      from(t in Wasail.Schema.Text,
        where:
          fragment(
            "fts_eng @@ websearch_to_tsquery(?)",
            ^query_str
          ),
        order_by: {
          :desc,
          fragment(
            "ts_rank_cd(fts_eng, websearch_to_tsquery(?), 4)",
            ^query_str
          )
        }
      )

    Repo.all(query)
  end

  def search(query_str) do
    case String.trim(query_str) |> String.length() do
      n when n < 3 ->
        []

      _ ->
        search_term =
          String.split(query_str, " ")
          |> Enum.map(fn x -> String.trim(x) end)
          |> Enum.reject(fn x -> String.length(x) == 0 end)
          |> Enum.map(fn x -> x <> ":*" end)
          |> Enum.join(" & ")

        # 'the:* | food:* | bar:*')

        Logger.info("search_term: #{inspect(search_term)}")

        query =
          from(t in Wasail.Schema.Text,
            join: r in Wasail.Schema.Report,
            on: t.report_id == r.id,
            join: c in Wasail.Schema.Chapter,
            on: r.chapter_id == c.id,
            join: s in Wasail.Schema.Section,
            on: c.section_id == s.id,
            join: b in Wasail.Schema.Book,
            on: s.book_id == b.id,
            where: fragment("fts_eng @@ to_tsquery(?)", ^search_term),
            select: %{
              matching_text:
                fragment(
                  """
                  ts_headline(
                    'english',
                    "text_eng",
                    to_tsquery(?),
                    'StartSel=<mark>,StopSel=</mark>,MinWords=25,MaxWords=75,MaxFragments=1'
                  )
                  """,
                  ^search_term
                ),
              report_id: t.report_id,
              report_heading: r.heading_eng,
              chapter_no: c.chapter_no,
              chapter_name: c.name_eng,
              section_no: s.section_no,
              section_name: s.name_eng,
              book_name: b.name_eng,
              volume_no: b.volume_no
            },
            limit: 40
          )

        Repo.all(query)
    end
  end
end

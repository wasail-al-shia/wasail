defmodule WasailWeb.Graphql.Schema do
  require Logger
  use Absinthe.Schema

  alias WasailWeb.Graphql.{
    BookResolver,
    SectionResolver,
    ChapterResolver,
    ReportResolver,
    TextResolver,
    CommentResolver
  }

  import_types(WasailWeb.Graphql.Types)

  query do
    @desc "Get user info"
    field :user_info, :user_info do
      resolve(fn _args, info ->
        case info.context do
          %{user_info: user_info} -> {:ok, user_info}
          _ -> {:ok, %{}}
        end
      end)
    end

    @desc "Get books"
    field :books, non_null(list_of(non_null(:book))) do
      resolve(&BookResolver.books/2)
    end

    @desc "Get book"
    field :book, non_null(:book) do
      arg(:book_id, non_null(:integer))
      resolve(&BookResolver.book_by_id/2)
    end

    @desc "Get sections"
    field :sections, non_null(list_of(non_null(:section))) do
      arg(:book_id, non_null(:integer))
      resolve(&SectionResolver.sections_by_book_id/2)
    end

    @desc "Get section"
    field :section, non_null(:section) do
      arg(:section_id, non_null(:integer))
      resolve(&SectionResolver.section_by_id/2)
    end

    @desc "Get chapters"
    field :chapters, non_null(list_of(non_null(:chapter))) do
      arg(:section_id, non_null(:integer))
      resolve(&ChapterResolver.chapters_by_section_id/2)
    end

    @desc "Get chapter"
    field :chapter, non_null(:chapter) do
      arg(:chapter_id, non_null(:integer))
      resolve(&ChapterResolver.chapter_by_id/2)
    end

    @desc "Get reports"
    field :reports, non_null(list_of(non_null(:report))) do
      arg(:chapter_id, non_null(:integer))
      resolve(&ReportResolver.reports_by_chapter_id/2)
    end

    @desc "Get report"
    field :report, non_null(:report) do
      arg(:report_id, non_null(:integer))
      resolve(&ReportResolver.report_by_id/2)
    end

    @desc "Get WS report id from report no"
    field :ws_report_id, :integer do
      arg(:report_no, non_null(:integer))
      resolve(&ReportResolver.get_ws_report_id/2)
    end

    @desc "Search Results"
    field :search_results, non_null(list_of(non_null(:search_result))) do
      arg(:query_str, non_null(:string))

      resolve(fn %{query_str: query_str}, _info ->
        {:ok, Wasail.Search.search(query_str)}
      end)
    end

    @desc "Get percent complete"
    field :percent_complete, non_null(:float) do
      arg(:book_id, non_null(:integer))

      resolve(fn %{book_id: book_id}, _info ->
        {:ok, Wasail.Book.percent_complete(book_id)}
      end)
    end
  end

  mutation do
    @desc "Add book"
    field :add_book, :mutation_response do
      arg(:input, non_null(:book_input))
      middleware(WasailWeb.Graphql.RequireAdmin)
      resolve(&BookResolver.add_book/2)
    end

    @desc "Update book"
    field :update_book, :mutation_response do
      arg(:input, non_null(:book_input))
      middleware(WasailWeb.Graphql.RequireAdmin)
      resolve(&BookResolver.update_book/2)
    end

    @desc "Delete book"
    field :delete_book, :mutation_response do
      arg(:book_id, :integer)
      middleware(WasailWeb.Graphql.RequireAdmin)
      resolve(&BookResolver.delete_book/2)
    end

    @desc "Update section"
    field :update_section, :mutation_response do
      arg(:section_id, non_null(:integer))
      arg(:section_no, :integer)
      arg(:name_eng, :string)
      arg(:name_arb, :string)
      arg(:desc_eng, :string)
      arg(:desc_arb, :string)
      middleware(WasailWeb.Graphql.RequireAdmin)
      resolve(&SectionResolver.update_section/2)
    end

    @desc "Delete section"
    field :delete_section, :mutation_response do
      arg(:section_id, :integer)
      middleware(WasailWeb.Graphql.RequireAdmin)
      resolve(&SectionResolver.delete_section/2)
    end

    @desc "Add section"
    field :add_section, :mutation_response do
      arg(:book_id, non_null(:integer))
      arg(:section_no, non_null(:integer))
      arg(:name_eng, non_null(:string))
      arg(:name_arb, :string)
      arg(:desc_eng, :string)
      arg(:desc_arb, :string)
      middleware(WasailWeb.Graphql.RequireAdmin)
      resolve(&SectionResolver.add_section/2)
    end

    @desc "Add chapter"
    field :add_chapter, :mutation_response do
      arg(:section_id, non_null(:integer))
      arg(:chapter_no, non_null(:integer))
      arg(:name_eng, non_null(:string))
      arg(:name_arb, :string)
      arg(:desc_eng, :string)
      arg(:desc_arb, :string)
      middleware(WasailWeb.Graphql.RequireAdmin)
      resolve(&ChapterResolver.add_chapter/2)
    end

    @desc "Update chapter"
    field :update_chapter, :mutation_response do
      arg(:chapter_id, non_null(:integer))
      arg(:chapter_no, :integer)
      arg(:name_eng, :string)
      arg(:name_arb, :string)
      arg(:desc_eng, :string)
      arg(:desc_arb, :string)
      middleware(WasailWeb.Graphql.RequireAdmin)
      resolve(&ChapterResolver.update_chapter/2)
    end

    @desc "Delete chapter"
    field :delete_chapter, :mutation_response do
      arg(:chapter_id, :integer)
      middleware(WasailWeb.Graphql.RequireAdmin)
      resolve(&ChapterResolver.delete_chapter/2)
    end

    @desc "Add Report"
    field :add_report, :mutation_response do
      arg(:chapter_id, non_null(:integer))
      arg(:report_no, non_null(:integer))
      arg(:heading_eng, non_null(:string))
      arg(:approved, :boolean)
      arg(:review, :boolean)
      middleware(WasailWeb.Graphql.RequireAdmin)
      resolve(&ReportResolver.add_report/2)
    end

    @desc "Add Report with Fragment"
    field :add_report_frag, :mutation_response do
      arg(:chapter_id, non_null(:integer))
      arg(:report_no, non_null(:integer))
      arg(:heading_eng, non_null(:string))
      arg(:approved, :boolean)
      arg(:review, :boolean)
      arg(:text_eng, non_null(:string))
      arg(:text_arb, non_null(:string))
      middleware(WasailWeb.Graphql.RequireAdmin)
      resolve(&ReportResolver.add_report_frag/2)
    end

    @desc "Update Report"
    field :update_report, :mutation_response do
      arg(:report_id, non_null(:integer))
      arg(:report_no, :integer)
      arg(:heading_eng, :string)
      arg(:approved, :boolean)
      arg(:review, :boolean)
      middleware(WasailWeb.Graphql.RequireAdmin)
      resolve(&ReportResolver.update_report/2)
    end

    @desc "Delete Report"
    field :delete_report, :mutation_response do
      arg(:report_id, non_null(:integer))
      middleware(WasailWeb.Graphql.RequireAdmin)
      resolve(&ReportResolver.delete_report/2)
    end

    @desc "Add Text"
    field :add_text, :mutation_response do
      arg(:report_id, non_null(:integer))
      arg(:fragment_no, non_null(:integer))
      arg(:text_eng, non_null(:string))
      arg(:text_arb, non_null(:string))
      middleware(WasailWeb.Graphql.RequireAdmin)
      resolve(&TextResolver.add_text/2)
    end

    @desc "Update Text"
    field :update_text, :mutation_response do
      arg(:text_id, non_null(:integer))
      arg(:fragment_no, :integer)
      arg(:text_eng, :string)
      arg(:text_arb, :string)
      middleware(WasailWeb.Graphql.RequireAdmin)
      resolve(&TextResolver.update_text/2)
    end

    @desc "Delete Text"
    field :delete_text, :mutation_response do
      arg(:text_id, non_null(:integer))
      middleware(WasailWeb.Graphql.RequireAdmin)
      resolve(&TextResolver.delete_text/2)
    end

    @desc "Add Comment"
    field :add_comment, :mutation_response do
      arg(:report_id, non_null(:integer))
      arg(:comment_seq_no, non_null(:integer))
      arg(:comment_eng, non_null(:string))
      arg(:comment_arb, :string)
      middleware(WasailWeb.Graphql.RequireAdmin)
      resolve(&CommentResolver.add_comment/2)
    end

    @desc "Update Comment"
    field :update_comment, :mutation_response do
      arg(:comment_id, non_null(:integer))
      arg(:comment_seq_no, :integer)
      arg(:comment_eng, :string)
      arg(:comment_arb, :string)
      middleware(WasailWeb.Graphql.RequireAdmin)
      resolve(&CommentResolver.update_comment/2)
    end

    @desc "Delete Comment"
    field :delete_comment, :mutation_response do
      arg(:comment_id, non_null(:integer))
      middleware(WasailWeb.Graphql.RequireAdmin)
      resolve(&CommentResolver.delete_comment/2)
    end
  end
end

defmodule WasailWeb.Graphql.Schema do
  require Logger
  use Absinthe.Schema

  alias WasailWeb.Graphql.{
    BookResolver,
    SectionResolver,
    ChapterResolver,
    ReportResolver,
    TextResolver,
    CommentResolver,
    EasyGuideResolver
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

    @desc "Get easy guide categories"
    field :easy_guide_categories, list_of(non_null(:easy_guide_category)) do
      resolve(&EasyGuideResolver.categories/2)
    end

    @desc "Get easy guide category"
    field :easy_guide_category, non_null(:easy_guide_category) do
      arg(:category_id, non_null(:integer))
      resolve(&EasyGuideResolver.category/2)
    end

    @desc "Get easy guides"
    field :easy_guides, list_of(non_null(:easy_guide)) do
      arg(:category_id, non_null(:integer))
      resolve(&EasyGuideResolver.easy_guides/2)
    end

    @desc "Get easy guide"
    field :easy_guide, non_null(:easy_guide) do
      arg(:id, non_null(:integer))
      resolve(&EasyGuideResolver.easy_guide/2)
      middleware(WasailWeb.Graphql.RecordActivity)
    end

    @desc "Get all easy guides"
    field :all_easy_guides, list_of(non_null(:easy_guide)) do
      resolve(&EasyGuideResolver.all_easy_guides/2)
    end

    @desc "Get fragments with report ids"
    field :easy_guide_report_fragments, list_of(non_null(:easy_guide_fragment)) do
      resolve(&EasyGuideResolver.report_fragments/2)
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

    @desc "Get section with reports"
    field :section_with_reports, non_null(:section) do
      arg(:section_id, non_null(:integer))
      resolve(&SectionResolver.section_with_reports_by_id/2)
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
      middleware(WasailWeb.Graphql.RecordActivity)
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
      middleware(WasailWeb.Graphql.RecordActivity)
    end

    @desc "Get WS report id from report no"
    field :ws_report_id, :integer do
      arg(:report_no, non_null(:integer))
      resolve(&ReportResolver.get_ws_report_id/2)
      middleware(WasailWeb.Graphql.RecordActivity)
    end

    @desc "Search"
    field :search, non_null(list_of(non_null(:search_result))) do
      arg(:query_str, non_null(:string))

      resolve(fn %{query_str: query_str}, _info ->
        {:ok, Wasail.Search.search(query_str)}
      end)

      middleware(WasailWeb.Graphql.RecordActivity)
    end

    @desc "Get percent complete"
    field :percent_complete, non_null(:float) do
      arg(:book_id, non_null(:integer))

      resolve(fn %{book_id: book_id}, _info ->
        {:ok, Wasail.Book.percent_complete(book_id)}
      end)
    end

    @desc "Get recent activity"
    field :recent_activity, non_null(list_of(non_null(:activity))) do
      arg(:n, non_null(:integer))
      middleware(WasailWeb.Graphql.RequireReviewer)

      resolve(fn %{n: n}, _info ->
        {:ok, Wasail.Activity.get_most_recent(n)}
      end)
    end

    @desc "Get unique visitors by day"
    field :unique_visitors_by_day, non_null(list_of(non_null(:unique_visitors_by_day))) do
      arg(:n, non_null(:integer))
      middleware(WasailWeb.Graphql.RequireReviewer)

      resolve(fn %{n: n}, _info ->
        {:ok, Wasail.Activity.get_unique_visitors_by_day(n)}
      end)
    end

    @desc "Get activity count"
    field :activity_count, non_null(:integer) do
      arg(:n, non_null(:integer))
      middleware(WasailWeb.Graphql.RequireReviewer)

      resolve(fn %{n: n}, _info ->
        {:ok, Wasail.Activity.count(n)}
      end)
    end

    @desc "Get report range for book"
    field :report_range_book, non_null(list_of(non_null(:report_range))) do
      arg(:book_id, non_null(:integer))

      resolve(fn %{book_id: book_id}, _info ->
        {:ok, Wasail.Section.report_range_book(book_id)}
      end)
    end

    @desc "Get report range for section"
    field :report_range_section, non_null(list_of(non_null(:report_range))) do
      arg(:section_id, non_null(:integer))

      resolve(fn %{section_id: section_id}, _info ->
        {:ok, Wasail.Section.report_range_section(section_id)}
      end)
    end

    @desc "Get most recent report"
    field :most_recent_report, non_null(:report) do
      resolve(fn _args, _info ->
        {:ok, Wasail.Report.get_most_recent()}
      end)
    end
  end

  mutation do
    @desc "Add easy guide category"
    field :add_easy_guide_category, :mutation_response do
      arg(:name, non_null(:string))
      arg(:description, non_null(:string))
      arg(:cat_seq_no, non_null(:integer))
      middleware(WasailWeb.Graphql.RequireAdmin)
      resolve(&EasyGuideResolver.add_category/2)
    end

    @desc "Update easy guide category"
    field :update_easy_guide_category, :mutation_response do
      arg(:id, non_null(:integer))
      arg(:name, :string)
      arg(:description, :string)
      arg(:cat_seq_no, :integer)
      middleware(WasailWeb.Graphql.RequireAdmin)
      resolve(&EasyGuideResolver.update_category/2)
    end

    @desc "Add easy guide"
    field :add_easy_guide, :mutation_response do
      arg(:easy_guide_category_id, non_null(:integer))
      arg(:title, non_null(:string))
      arg(:abbreviated, non_null(:string))
      arg(:eg_seq_no, non_null(:integer))
      arg(:hide, :boolean)
      middleware(WasailWeb.Graphql.RequireAdmin)
      resolve(&EasyGuideResolver.add_easy_guide/2)
    end

    @desc "Update easy guide"
    field :update_easy_guide, :mutation_response do
      arg(:id, non_null(:integer))
      arg(:title, :string)
      arg(:abbreviated, :string)
      arg(:eg_seq_no, :integer)
      arg(:hide, :boolean)
      middleware(WasailWeb.Graphql.RequireAdmin)
      resolve(&EasyGuideResolver.update_easy_guide/2)
    end

    @desc "Add easy guide fragment"
    field :add_easy_guide_fragment, :mutation_response do
      arg(:easy_guide_id, non_null(:integer))
      arg(:frag_seq_no, non_null(:integer))
      arg(:html, :string)
      arg(:heading, :string)
      arg(:list, :string)
      arg(:numbered_list, :boolean)
      arg(:report_id, :integer)
      middleware(WasailWeb.Graphql.RequireAdmin)
      resolve(&EasyGuideResolver.add_fragment/2)
    end

    @desc "Update easy guide fragment"
    field :update_easy_guide_fragment, :mutation_response do
      arg(:id, non_null(:integer))
      arg(:frag_seq_no, :integer)
      arg(:report_id, :integer)
      arg(:html, :string)
      arg(:heading, :string)
      arg(:list, :string)
      arg(:numbered_list, :boolean)
      middleware(WasailWeb.Graphql.RequireAdmin)
      resolve(&EasyGuideResolver.update_fragment/2)
    end

    @desc "Delete category"
    field :delete_category, :mutation_response do
      arg(:id, :integer)
      middleware(WasailWeb.Graphql.RequireAdmin)
      resolve(&EasyGuideResolver.delete_category/2)
    end

    @desc "Delete easy guide"
    field :delete_easy_guide, :mutation_response do
      arg(:id, :integer)
      middleware(WasailWeb.Graphql.RequireAdmin)
      resolve(&EasyGuideResolver.delete_easy_guide/2)
    end

    @desc "Delete easy guide fragment"
    field :delete_easy_guide_fragment, :mutation_response do
      arg(:id, :integer)
      middleware(WasailWeb.Graphql.RequireAdmin)
      resolve(&EasyGuideResolver.delete_fragment/2)
    end

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
      arg(:notes, :string)
      arg(:approved, :boolean)
      arg(:review, :boolean)
      arg(:hide, :boolean)
      arg(:easy_guide_id, :integer)
      arg(:easy_guide_frag_no, :integer)
      middleware(WasailWeb.Graphql.RequireAdmin)
      resolve(&ReportResolver.add_report/2)
    end

    @desc "Add Report with Fragment"
    field :add_report_frag, :mutation_response do
      arg(:chapter_id, non_null(:integer))
      arg(:report_no, non_null(:integer))
      arg(:heading_eng, non_null(:string))
      arg(:notes, :string)
      arg(:approved, :boolean)
      arg(:review, :boolean)
      arg(:hide, :boolean)
      arg(:easy_guide_id, :integer)
      arg(:easy_guide_frag_no, :integer)
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
      arg(:notes, :string)
      arg(:approved, :boolean)
      arg(:review, :boolean)
      arg(:hide, :boolean)
      arg(:easy_guide_id, :integer)
      arg(:easy_guide_frag_no, :integer)
      middleware(WasailWeb.Graphql.RequireReviewer)
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

    @desc "Process Contact Form"
    field :process_contact_form, :mutation_response do
      arg(:name, non_null(:string))
      arg(:email, non_null(:string))
      arg(:subject, non_null(:string))
      arg(:comment, non_null(:string))

      middleware(WasailWeb.Graphql.RecordActivity)

      resolve(fn %{subject: subject, comment: comment, name: name, email: email}, _info ->
        Task.async(fn ->
          try do
            Wasail.Mailer.send_contact_us_email(subject, comment, name, email)
          rescue
            err ->
              Logger.error("Error sending contact us email: #{inspect(err)}")
          end
        end)

        {:ok, %{status: :ok, message: "Processed contact form"}}
      end)
    end

    @desc "Process Report Feedback"
    field :process_report_feedback, :mutation_response do
      arg(:report_id, non_null(:integer))
      arg(:name, non_null(:string))
      arg(:email, non_null(:string))
      arg(:comment, non_null(:string))
      middleware(WasailWeb.Graphql.RecordActivity)

      resolve(fn %{report_id: report_id, comment: comment, name: name, email: email}, _info ->
        Task.async(fn ->
          try do
            Wasail.Mailer.send_report_feedback(report_id, comment, name, email)
          rescue
            err -> Logger.error("Error sending report feedback: #{inspect(err)}")
          end
        end)

        {:ok, %{status: :ok, message: "Processed report feedback"}}
      end)
    end

    # @desc "Delete Activity"
    # field :delete_activity, :mutation_response do
    #   arg(:older_than_days, :integer)
    #   middleware(WasailWeb.Graphql.RequireAdmin)
    #   resolve(&BookResolver.delete_book/2)
    # end
  end
end

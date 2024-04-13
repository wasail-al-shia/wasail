defmodule WasailWeb.Graphql.Types do
  use Absinthe.Schema.Notation
  import_types(Absinthe.Type.Custom)

  object :mutation_response do
    field :status, :string
    field :message, :string
  end

  object :user_info do
    field :uid, :string
    field :name, :string
    field :email, :string
    field :avatar_url, :string
    field :is_admin, :boolean
  end

  object :book do
    field :id, non_null(:integer)
    field :name_eng, non_null(:string)
    field :code, non_null(:string)
    field :author_eng, non_null(:string)
    field :volume_no, non_null(:integer)
    field :library_seq_no, non_null(:integer)
    field :description, :string

    field :sections, list_of(:section)
  end

  object :section do
    field :id, non_null(:integer)
    field :section_no, non_null(:integer)
    field :name_eng, non_null(:string)
    field :name_arb, :string
    field :desc_eng, :string
    field :desc_arb, :string
    field :book, non_null(:book)

    field :chapters, list_of(:chapter)
  end

  object :chapter do
    field :id, non_null(:integer)
    field :chapter_no, non_null(:integer)
    field :name_eng, non_null(:string)
    field :name_arb, :string
    field :desc_eng, :string
    field :desc_arb, :string
    field :section, non_null(:section)

    field :reports, list_of(:report)
  end

  object :tag do
    field :tag_name, non_null(:string)
    field :report_id, non_null(:integer)
    field :report, :report
  end

  object :report do
    field :id, non_null(:integer)
    field :chapter_id, non_null(:integer)
    field :report_no, non_null(:integer)
    field :heading_eng, :string
    field :chapter, non_null(:chapter)
    field :review, non_null(:boolean)
    field :hide, non_null(:boolean)
    field :inserted_at, non_null(:naive_datetime)

    field :texts, list_of(:text)
    field :comments, list_of(:comment)
    field :tags, list_of(:tag)
  end

  object :text do
    field :id, non_null(:integer)
    field :report_id, non_null(:integer)
    field :fragment_no, non_null(:integer)
    field :text_eng, non_null(:string)
    field :text_arb, non_null(:string)
  end

  object :comment do
    field :id, non_null(:integer)
    field :report_id, non_null(:integer)
    field :comment_seq_no, non_null(:integer)
    field :comment_eng, non_null(:string)
    field :comment_arb, :string
  end

  object :article do
    field :id, non_null(:integer)
    field :title, non_null(:string)
    field :article_seq_no, non_null(:integer)
    field :description, :string
    field :article_comments, :string
    field :reports, non_null(list_of(:report))
  end

  object :search_result do
    field :matching_text, non_null(:string)
    field :report_id, non_null(:integer)
    field :report_heading, non_null(:string)
    field :chapter_no, non_null(:integer)
    field :chapter_name, non_null(:string)
    field :section_no, non_null(:integer)
    field :section_name, non_null(:string)
    field :book_name, non_null(:string)
    field :volume_no, non_null(:integer)
  end

  object :activity do
    field :id, non_null(:integer)
    field :activity_type, non_null(:string)
    field :ip, non_null(:string)
    field :user_agent, :string
    field :country, :string
    field :region, :string
    field :city, :string
    field :chapter_id, :integer
    field :report_id, :integer
    field :search_str, :string
    field :desc, :string
    field :inserted_at, non_null(:naive_datetime)
  end

  object :unique_visitors_by_day do
    field :date, non_null(:date)
    field :num_visitors, non_null(:integer)
  end

  object :report_range do
    field :entity_id, non_null(:integer)
    field :start_report_no, non_null(:integer)
    field :end_report_no, non_null(:integer)
  end

  input_object :book_input do
    field :id, :integer
    field :name_eng, :string
    field :code, :string
    field :author_eng, :string
    field :volume_no, :integer
    field :library_seq_no, :integer
    field :description, :string
  end
end

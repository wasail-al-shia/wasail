defmodule Wasail.Schema.EasyGuide do
  use Ecto.Schema

  schema "easy_guide" do
    belongs_to :easy_guide_category, Wasail.Schema.EasyGuideCategory
    field :title, :string
    field :abbreviated, :string
    field :eg_seq_no, :integer

    has_many :easy_guide_fragments, Wasail.Schema.EasyGuideFragment,
      preload_order: [asc: :frag_seq_no]

    timestamps()
  end
end

defmodule Wasail.Schema.EasyGuideCategory do
  use Ecto.Schema

  schema "easy_guide_category" do
    field :name, :string
    field :cat_seq_no, :integer
    field :description, :string
    has_many :easy_guides, Wasail.Schema.EasyGuide, preload_order: [asc: :eg_seq_no]
    timestamps()
  end
end

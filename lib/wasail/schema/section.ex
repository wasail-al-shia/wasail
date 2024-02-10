defmodule Wasail.Schema.Section do
  use Ecto.Schema

  schema "section" do
    belongs_to :book, Wasail.Schema.Book
    field :section_no, :integer
    field :name_eng, :string
    field :name_arb, :string
    field :desc_eng, :string
    field :desc_arb, :string

    has_many :chapters, Wasail.Schema.Chapter, preload_order: [asc: :chapter_no]
    timestamps()
  end
end

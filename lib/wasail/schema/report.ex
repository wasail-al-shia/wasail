defmodule Wasail.Schema.Report do
  use Ecto.Schema

  schema "report" do
    belongs_to :chapter, Wasail.Schema.Chapter
    field :report_no, :integer
    field :heading_eng, :string
    field :heading_arb, :string
    field :hide, :boolean
    field :review, :boolean
    field :notes, :string

    has_many :texts, Wasail.Schema.Text, preload_order: [asc: :fragment_no]
    has_many :comments, Wasail.Schema.Comment, preload_order: [asc: :comment_seq_no]
    timestamps()
  end
end

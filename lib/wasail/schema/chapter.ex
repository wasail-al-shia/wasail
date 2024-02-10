defmodule Wasail.Schema.Chapter do
  use Ecto.Schema

  schema "chapter" do
    belongs_to :section, Wasail.Schema.Section
    field :chapter_no, :integer
    field :name_eng, :string
    field :name_arb, :string
    field :desc_eng, :string
    field :desc_arb, :string
    has_many :reports, Wasail.Schema.Report, preload_order: [asc: :report_no]
    timestamps()
  end
end

defmodule Wasail.Schema.EasyGuideFragment do
  use Ecto.Schema

  schema "easy_guide_fragment" do
    belongs_to :easy_guide, Wasail.Schema.EasyGuide
    belongs_to :report, Wasail.Schema.Report
    field :frag_seq_no, :integer
    field :html, :string
    timestamps()
  end
end

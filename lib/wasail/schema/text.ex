defmodule Wasail.Schema.Text do
  use Ecto.Schema

  schema "text" do
    belongs_to :report, Wasail.Schema.Report
    field :fragment_no, :integer
    field :text_eng, :string
    field :text_arb, :string
    timestamps()
  end
end

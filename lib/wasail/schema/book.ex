defmodule Wasail.Schema.Book do
  use Ecto.Schema

  schema "book" do
    field :name_eng, :string
    field :author_eng, :string
    field :desc_eng, :string
    field :name_arb, :string
    field :author_arb, :string
    field :desc_arb, :string
    field :volume_no, :integer
    field :library_seq_no, :integer
    has_many :sections, Wasail.Schema.Section
    timestamps()
  end
end

defmodule Wasail.EasyGuideFragment do
  require Logger
  import Ecto.Query
  alias Wasail.Repo
  alias Wasail.Schema.EasyGuideFragment, as: EasyGuideFragment
  alias Wasail.Util.Query, as: QueryUtil

  def get(id), do: Repo.get(EasyGuideFragment, id)

  def get_by_easy_guide_id(easy_guide_id) do
    EasyGuideFragment
    |> QueryUtil.put_filters(easy_guide_id: easy_guide_id)
    |> QueryUtil.put_sort(asc: :frag_seq_no)
    |> Repo.all()
  end

  def get_report_fragments() do
    EasyGuideFragment
    |> where([f], not is_nil(f.report_id))
    |> Repo.all()
    |> Repo.preload(:easy_guide)
  end

  def insert(rec) do
    Logger.info("In insert: rec=#{inspect(rec)}")

    %EasyGuideFragment{}
    |> changeset(rec)
    |> Repo.insert()
  end

  def update(easy_guide_id, changes = %{}) do
    easy_guide_id
    |> get()
    |> changeset(changes)
    |> Repo.update()
  end

  def changeset(%EasyGuideFragment{} = easy_guide_fragment, attrs \\ %{}) do
    easy_guide_fragment
    |> Ecto.Changeset.cast(attrs, [
      :easy_guide_id,
      :frag_seq_no,
      :report_id,
      :html,
      :heading,
      :list,
      :numbered_list
    ])
    |> Ecto.Changeset.validate_required([
      :easy_guide_id,
      :frag_seq_no
    ])
  end

  def delete(id) do
    get(id)
    |> case do
      %EasyGuideFragment{} = f -> Repo.delete(f)
      nil -> nil
    end
  end

  def validate_unless_other_present(changeset, required_field, the_other_field) do
    case Ecto.Changeset.get_field(changeset, the_other_field) do
      # the other field is not present, validate away
      nil -> Ecto.Changeset.validate_required(changeset, required_field)
      # the other field is present, skip validation
      _value -> changeset
    end
  end
end

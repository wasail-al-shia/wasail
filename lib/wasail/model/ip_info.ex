defmodule Wasail.IpInfo do
  alias Wasail.Repo
  alias Wasail.Schema.IpInfo, as: IpInfo
  alias Wasail.Util.Query, as: QueryUtil

  def get(id), do: Repo.get(IpInfo, id)

  def get_by_ip(ip) do
    IpInfo
    |> QueryUtil.put_filters(ip: ip)
    |> Repo.one()
  end

  def insert!(rec),
    do:
      %IpInfo{}
      |> changeset(rec)
      |> Repo.insert!()

  def changeset(%IpInfo{} = ip_info, attrs \\ %{}) do
    ip_info
    |> Ecto.Changeset.cast(attrs, [
      :ip,
      :country,
      :region,
      :city
    ])
    |> Ecto.Changeset.validate_required([
      :ip
    ])
  end

  def delete(id) do
    get(id)
    |> case do
      %IpInfo{} = i -> Repo.delete(i)
      nil -> nil
    end
  end
end

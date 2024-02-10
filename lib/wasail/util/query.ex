defmodule Wasail.Util.Query do
  import Ecto.Query

  def put_filter(query, {key, value}), do: put_filter(query, {key, :==, value})
  # most databses don't consider null as a value,
  # in elixir if x is null then x != "test" or x not in ["test"] is true
  # but in db the row won't get included if x is null

  def put_filter(query, {key, :==, nil}) when is_atom(key),
    do: where(query, [x], field(x, ^key) |> is_nil())

  def put_filter(query, {key, :!=, nil}) when is_atom(key),
    do: where(query, [x], not (field(x, ^key) |> is_nil()))

  def put_filter(query, {key, :==, value}) when is_atom(key),
    do: where(query, [x], field(x, ^key) == ^value)

  def put_filter(query, {key, :!=, value}) when is_atom(key),
    do: where(query, [x], is_nil(field(x, ^key)) or field(x, ^key) != ^value)

  def put_filter(query, {key, :in, value}) when is_atom(key) and is_list(value) do
    if nil in value do
      value = Enum.reject(value, &is_nil/1)
      where(query, [x], is_nil(field(x, ^key)) or field(x, ^key) in ^value)
    else
      where(query, [x], field(x, ^key) in ^value)
    end
  end

  def put_filter(query, {key, :not_in, value}) when is_atom(key) and is_list(value) do
    if nil in value do
      value = Enum.reject(value, &is_nil/1)
      where(query, [x], field(x, ^key) not in ^value)
    else
      where(query, [x], is_nil(field(x, ^key)) or field(x, ^key) not in ^value)
    end
  end

  # when column is type list
  def put_filter(query, {value, :in, key}) when is_atom(key),
    do: where(query, [x], ^value in field(x, ^key))

  def put_filter(query, {value, :not_in, key}) when is_atom(key),
    do: where(query, [x], ^value not in field(x, ^key))

  def put_filter(query, _), do: query

  def put_filters(query, filters) when is_list(filters) or is_map(filters),
    do: Enum.reduce(filters, query, &put_filter(&2, &1))

  def put_sort(query, sort_by) when is_atom(sort_by) or is_list(sort_by),
    do: order_by(query, ^sort_by)

  def select_map(query, fields = [_ | _]),
    do: select(query, [x], map(x, ^fields))

  def select_field(query, field) when is_atom(field),
    do: select(query, [x], field(x, ^field))

  def put_limit(query, limit) when is_integer(limit), do: limit(query, ^limit)
end

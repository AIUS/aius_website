defmodule AiusWebsite.Term.Period do
  use Ecto.Schema
  import Ecto.Changeset
  import AiusWebsite.Repo.Utils

  schema "periods" do
    field :end, :date
    field :start, :date

    timestamps()
    authors()
  end

  @doc false
  def changeset(period, attrs) do
    period
    |> cast(attrs, [:start, :end])
    |> set_author(Map.get(attrs, :author))
    |> validate_required([:start, :end])
    |> check_constraint(:start, name: :boundaries_in_order)
    |> check_constraint(:end, name: :boundaries_in_order)
  end
end

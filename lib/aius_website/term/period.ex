defmodule AiusWebsite.Term.Period do
  use Ecto.Schema
  import Ecto.Changeset

  schema "periods" do
    field :end, :date
    field :start, :date

    timestamps()
  end

  @doc false
  def changeset(period, attrs) do
    period
    |> cast(attrs, [:start, :end])
    |> validate_required([:start, :end])
    |> check_constraint(:start, name: :boundaries_in_order)
    |> check_constraint(:end, name: :boundaries_in_order)
  end
end

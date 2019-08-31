defmodule AiusWebsite.Members.Membership do
  use Ecto.Schema
  import Ecto.Changeset
  alias AiusWebsite.Term.Period
  alias AiusWebsite.Members.User

  schema "memberships" do
    field :valid, :boolean

    belongs_to :user, User
    belongs_to :period, Period

    timestamps()
  end

  @doc false
  def changeset(membership, attrs) do
    membership
    |> cast(attrs, [:valid, :user_id, :period_id])
    |> assoc_constraint(:user)
    |> assoc_constraint(:period)
    |> validate_required([:valid])
  end
end

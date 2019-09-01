defmodule AiusWebsite.Members.Membership do
  use Ecto.Schema
  import Ecto.Changeset
  import AiusWebsite.Repo.Utils
  alias AiusWebsite.Term.Period
  alias AiusWebsite.Members.User

  schema "memberships" do
    field :valid, :boolean

    belongs_to :user, User
    belongs_to :period, Period

    timestamps()
    authors()
  end

  @doc false
  def changeset(membership, attrs) do
    membership
    |> cast(attrs, [:valid, :user_id, :period_id])
    |> set_author("foo")
    |> assoc_constraint(:user)
    |> assoc_constraint(:period)
    |> validate_required([:valid])
  end
end

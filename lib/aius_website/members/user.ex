defmodule AiusWebsite.Members.User do
  alias AiusWebsite.Members.Membership
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :first_name, :string
    field :middle_name, :string, default: ""
    field :last_name, :string
    field :email, :string
    field :subscribed, :boolean, default: false

    has_many :memberships, Membership

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:first_name, :middle_name, :last_name, :email, :subscribed])
    |> cast_assoc(:memberships, with: &Membership.changeset/2)
    |> validate_required([:first_name, :last_name, :email])
    |> validate_format(:email, ~r/@/)
    |> unique_constraint(:email)
  end
end

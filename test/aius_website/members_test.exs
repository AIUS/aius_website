defmodule AiusWebsite.MembersTest do
  use AiusWebsite.DataCase

  alias AiusWebsite.Members

  describe "user" do
    alias AiusWebsite.Members.User

    @valid_attrs %{
      email: "some@email",
      first_name: "some first_name",
      last_name: "some last_name",
      middle_name: "some middle_name",
      subscribed: true
    }
    @update_attrs %{
      email: "some_updated@email",
      first_name: "some updated first_name",
      last_name: "some updated last_name",
      middle_name: "some updated middle_name"
    }
    @invalid_attrs %{email: nil, first_name: nil, last_name: nil, middle_name: nil}

    def user_fixture(attrs \\ %{}) do
      {:ok, user} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Members.create_user()

      user
    end

    test "list_users/0 returns all user" do
      user = user_fixture()
      assert Members.list_users() == [user]
    end

    test "get_user!/1 returns the user with given id" do
      user = user_fixture()
      assert Members.get_user!(user.id) == user
    end

    test "create_user/1 with valid data creates a user" do
      assert {:ok, %User{} = user} = Members.create_user(@valid_attrs)
      assert user.email == "some@email"
      assert user.first_name == "some first_name"
      assert user.last_name == "some last_name"
      assert user.middle_name == "some middle_name"
    end

    test "create_user/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Members.create_user(@invalid_attrs)
    end

    test "update_user/2 with valid data updates the user" do
      user = user_fixture()
      assert {:ok, %User{} = user} = Members.update_user(user, @update_attrs)
      assert user.email == "some_updated@email"
      assert user.first_name == "some updated first_name"
      assert user.last_name == "some updated last_name"
      assert user.middle_name == "some updated middle_name"
    end

    test "update_user/2 with invalid data returns error changeset" do
      user = user_fixture()
      assert {:error, %Ecto.Changeset{}} = Members.update_user(user, @invalid_attrs)
      assert user == Members.get_user!(user.id)
    end

    test "delete_user/1 deletes the user" do
      user = user_fixture()
      assert {:ok, %User{}} = Members.delete_user(user)
      assert_raise Ecto.NoResultsError, fn -> Members.get_user!(user.id) end
    end

    test "change_user/1 returns a user changeset" do
      user = user_fixture()
      assert %Ecto.Changeset{} = Members.change_user(user)
    end
  end

  describe "memberships" do
    alias AiusWebsite.Members.Membership

    @valid_attrs %{valid: true}
    @update_attrs %{valid: false}
    @invalid_attrs %{valid: nil}

    def membership_fixture(attrs \\ %{}) do
      user = user_fixture()

      {:ok, membership} = Members.create_membership(user, Enum.into(attrs, @valid_attrs))

      membership
    end

    test "list_memberships/0 returns all memberships" do
      membership = membership_fixture()
      assert Members.list_memberships(membership.user) |> Repo.preload(:user) == [membership]
    end

    test "get_membership!/1 returns the membership with given id" do
      membership = membership_fixture()
      assert Members.get_membership!(membership.user, membership.id) == membership
    end

    test "create_membership/1 with valid data creates a membership" do
      user = user_fixture()
      assert {:ok, %Membership{} = membership} = Members.create_membership(user, @valid_attrs)
    end

    test "create_membership/1 with invalid data returns error changeset" do
      user = user_fixture()
      assert {:error, %Ecto.Changeset{}} = Members.create_membership(user, @invalid_attrs)
    end

    test "update_membership/2 with valid data updates the membership" do
      membership = membership_fixture()

      assert {:ok, %Membership{} = membership} =
               Members.update_membership(membership, @update_attrs)
    end

    test "update_membership/2 with invalid data returns error changeset" do
      membership = membership_fixture()
      assert {:error, %Ecto.Changeset{}} = Members.update_membership(membership, @invalid_attrs)
      assert membership == Members.get_membership!(membership.user, membership.id)
    end

    test "delete_membership/1 deletes the membership" do
      membership = membership_fixture()
      assert {:ok, %Membership{}} = Members.delete_membership(membership)

      assert_raise Ecto.NoResultsError, fn ->
        Members.get_membership!(membership.user, membership.id)
      end
    end

    test "change_membership/1 returns a membership changeset" do
      membership = membership_fixture()
      assert %Ecto.Changeset{} = Members.change_membership(membership)
    end
  end
end

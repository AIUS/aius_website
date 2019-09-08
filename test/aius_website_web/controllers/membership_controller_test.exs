defmodule AiusWebsiteWeb.MembershipControllerTest do
  use AiusWebsiteWeb.ConnCase

  alias AiusWebsite.Members
  alias AiusWebsite.Members.Membership
  alias AiusWebsite.Members.User
  alias AiusWebsite.Term
  alias AiusWebsite.Term.Period

  def fixture(:period) do
    {:ok, period} = Term.create_period(%{start: "2019-09-01", end: "2020-08-31"})
    period
  end

  def fixture(:user) do
    {:ok, user} =
      Members.create_user(%{
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        birthdate: "1997-06-14",
        subscribed: true
      })

    user
  end

  def fixture(:membership) do
    user = fixture(:user)
    period = fixture(:period)

    {:ok, membership} =
      Members.create_membership(user, %{period_id: period.id, valid: true, situation: "bar"})

    membership
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    setup [:create_user]

    test "lists all memberships", %{conn: conn, user: %User{id: user_id}} do
      conn = get(conn, Routes.user_membership_path(conn, :index, user_id))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create membership" do
    setup [:create_user, :create_period]

    test "renders membership when data is valid", %{
      conn: conn,
      user: %User{id: user_id},
      period: %Period{id: period_id}
    } do
      conn =
        post(conn, Routes.user_membership_path(conn, :create, user_id),
          membership: %{
            period_id: period_id,
            valid: true,
            situation: "foo"
          }
        )

      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.user_membership_path(conn, :show, user_id, id))

      assert %{
               "id" => id,
               "valid" => true,
               "period" => %{
                 "start" => "2019-09-01",
                 "end" => "2020-08-31"
               },
               "situation" => "foo"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, user: %User{id: user_id}} do
      conn =
        post(conn, Routes.user_membership_path(conn, :create, user_id),
          membership: %{period_id: nil}
        )

      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update membership" do
    setup [:create_membership]

    test "renders membership when data is valid", %{
      conn: conn,
      membership: %Membership{id: id} = membership
    } do
      conn =
        put(conn, Routes.user_membership_path(conn, :update, membership.user_id, membership),
          membership: %{valid: false}
        )

      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.user_membership_path(conn, :show, membership.user_id, id))

      assert %{
               "id" => id,
               "valid" => false
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, membership: membership} do
      conn =
        put(conn, Routes.user_membership_path(conn, :update, membership.user_id, membership),
          membership: %{valid: nil}
        )

      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete membership" do
    setup [:create_membership]

    test "deletes chosen membership", %{conn: conn, membership: membership} do
      conn =
        delete(conn, Routes.user_membership_path(conn, :delete, membership.user_id, membership))

      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.user_membership_path(conn, :show, membership.user_id, membership))
      end
    end
  end

  defp create_membership(_) do
    membership = fixture(:membership)
    {:ok, membership: membership}
  end

  defp create_user(_) do
    user = fixture(:user)
    {:ok, user: user}
  end

  defp create_period(_) do
    period = fixture(:period)
    {:ok, period: period}
  end
end

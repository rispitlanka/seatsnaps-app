# Legacy screens

API-connected screens replaced by the board-1 UI rebuild. They are not routed; keep them as a reference for wiring the new screens to the API (events list, event detail, ticket selection, PayHere checkout, sign-in and sign-up).

Board 2 also replaced: account (profile, edit, change password), tickets list and ticket detail, forgot password and reset password. These used getMe/updateMe/changePassword, listOrders/listTickets/getTicket and forgotPassword/resetPassword.

This folder is excluded from type-checking (tsconfig "exclude"); its route links point at screens that no longer exist.

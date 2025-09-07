"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { Database } from "@/types/supabase";

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // useStateを使って、Supabaseクライアントが一度だけ作成されるようにします。
  // これにより、コンポーネントが再描画されてもインスタンスは再利用されます。
  const [supabaseClient] = useState(() =>
    createClientComponentClient<Database>()
  );

  return (
    <SessionContextProvider supabaseClient={supabaseClient as never}>
      {children}
    </SessionContextProvider>
  );
}

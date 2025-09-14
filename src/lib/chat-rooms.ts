import { createClient } from './supabase/client';
import type { Tables } from './types_db';

type ChatRoom = Tables<'chat_rooms'>;

export async function createOrGetChatRoom(studentId: string, companyId: string): Promise<{ success: boolean; roomId?: string; error?: string }> {
  const supabase = createClient();

  try {
    console.log('Creating or getting chat room for:', { studentId, companyId });

    // 既存のチャットルームを検索
    const { data: existingRoom, error: searchError } = await supabase
      .from('chat_rooms')
      .select('*')
      .eq('student_id', studentId)
      .eq('company_id', companyId)
      .single();

    console.log('Existing room search:', { existingRoom, searchError });

    if (searchError && searchError.code !== 'PGRST116') {
      // PGRST116は「該当データなし」なので問題なし、それ以外はエラー
      console.error('Search error (not PGRST116):', searchError);
      throw searchError;
    }

    if (existingRoom) {
      console.log('Found existing chat room:', existingRoom.id);
      return {
        success: true,
        roomId: existingRoom.id
      };
    }

    // 新しいチャットルームを作成
    console.log('Creating new chat room...');
    const { data: newRoom, error: createError } = await supabase
      .from('chat_rooms')
      .insert({
        student_id: studentId,
        company_id: companyId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (createError) {
      console.error('Create error:', createError);
      throw createError;
    }

    console.log('New chat room created:', newRoom.id);
    return {
      success: true,
      roomId: newRoom.id
    };

  } catch (error) {
    console.error('Error creating/getting chat room:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'チャットルームの作成中にエラーが発生しました'
    };
  }
}

export async function getChatRoomForUsers(studentId: string, companyId: string): Promise<{ success: boolean; roomId?: string; error?: string }> {
  const supabase = createClient();

  try {
    const { data: room, error } = await supabase
      .from('chat_rooms')
      .select('id')
      .eq('student_id', studentId)
      .eq('company_id', companyId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // チャットルームが存在しない
        return {
          success: false,
          error: 'チャットルームが見つかりません'
        };
      }
      throw error;
    }

    return {
      success: true,
      roomId: room.id
    };

  } catch (error) {
    console.error('Error getting chat room:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'チャットルームの取得中にエラーが発生しました'
    };
  }
}

export async function getUserChatRooms(userId: string, userType: 'student' | 'company'): Promise<{ success: boolean; rooms?: any[]; error?: string }> {
  const supabase = createClient();

  try {
    let query;

    if (userType === 'student') {
      query = supabase
        .from('chat_rooms')
        .select(`
          *,
          company:company_id (
            id,
            name,
            logo
          )
        `)
        .eq('student_id', userId);
    } else {
      // company の場合、まず company_id を取得
      const { data: company } = await supabase
        .from('company')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (!company) {
        return {
          success: false,
          error: '企業情報が見つかりません'
        };
      }

      query = supabase
        .from('chat_rooms')
        .select(`
          *,
          student:student_id (
            id,
            email
          )
        `)
        .eq('company_id', company.id);
    }

    const { data: rooms, error } = await query.order('updated_at', { ascending: false });

    if (error) {
      throw error;
    }

    return {
      success: true,
      rooms: rooms || []
    };

  } catch (error) {
    console.error('Error getting user chat rooms:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'チャットルーム一覧の取得中にエラーが発生しました'
    };
  }
}
export type UserProfile = {
    name: string;
    email: string;
}

export type AuthContextType = {
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    updateProfile: (profile: UserProfile) => void;
    isAuthenticated: boolean;
    profile: UserProfile | null;
}

export type EventPreview = {
    id: string;
    name: string;
    start_time: string;
    end_time: string;
    guest_invited: number;
    guest_checked_in: number;
}

export type EventList = {
    current_event: EventPreview;
    future_events: EventPreview[];
    past_events: EventPreview[];
}

export type GuestListItem = {
    id: string;
    name: string;
    invitedBy: string;
    checkedIn: boolean;
}

export type EventDetails = {
    id: string;
    name: string;
    start_time: string;
    end_time: string;
    guest_invited: number;
    guest_checked_in: number;
    guestList: GuestListItem[];
}
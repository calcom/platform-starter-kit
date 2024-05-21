export namespace Schemas {
  // <Schemas>
  export type ManagedUserOutput = {
    id: number;
    email: string;
    username: string | null;
    timeZone: string;
    weekStart: string;
    createdDate: string;
    timeFormat: number | null;
    defaultScheduleId: number | null;
  };
  export type GetManagedUsersOutput = { status: "success" | "error"; data: Array<ManagedUserOutput> };
  export type CreateManagedUserInput = {
    email: string;
    timeFormat?: 12 | 24 | undefined;
    weekStart?:
      | "Monday"
      | "Tuesday"
      | "Wednesday"
      | "Thursday"
      | "Friday"
      | "Saturday"
      | "Sunday"
      | undefined;
    timeZone?: string | undefined;
    name?: string | undefined;
  };
  export type CreateManagedUserData = { user: ManagedUserOutput; accessToken: string; refreshToken: string };
  export type CreateManagedUserOutput = { status: "success" | "error"; data: CreateManagedUserData };
  export type GetManagedUserOutput = { status: "success" | "error"; data: ManagedUserOutput };
  export type UpdateManagedUserInput = Partial<{
    timeFormat: 12 | 24;
    weekStart: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
    email: string;
    name: string;
    defaultScheduleId: number;
    timeZone: string;
  }>;
  export type KeysDto = { accessToken: string; refreshToken: string };
  export type KeysResponseDto = { status: "success" | "error"; data: KeysDto };
  export type CreateOAuthClientInput = Partial<{}>;
  export type DataDto = { clientId: string; clientSecret: string };
  export type CreateOAuthClientResponseDto = { status: "success" | "error"; data: DataDto };
  export type PlatformOAuthClientDto = {
    id: string;
    name: string;
    secret: string;
    permissions: number;
    logo?: string | null | undefined;
    redirectUris: Array<string>;
    organizationId: number;
    createdAt: string;
  };
  export type GetOAuthClientsResponseDto = {
    status: "success" | "error";
    data: Array<PlatformOAuthClientDto>;
  };
  export type GetOAuthClientResponseDto = { status: "success" | "error"; data: PlatformOAuthClientDto };
  export type UpdateOAuthClientInput = Partial<{
    logo: string;
    name: string;
    redirectUris: Array<string>;
    bookingRedirectUri: string;
    bookingCancelRedirectUri: string;
    bookingRescheduleRedirectUri: string;
    areEmailsEnabled: boolean;
  }>;
  export type OAuthAuthorizeInput = { redirectUri: string };
  export type ExchangeAuthorizationCodeInput = { clientSecret: string };
  export type RefreshTokenInput = { refreshToken: string };
  export type EventTypeLocation = { type: string; link?: string | undefined };
  export type CreateEventTypeInput = {
    length: number;
    slug: string;
    title: string;
    description?: string | undefined;
    locations?: Array<EventTypeLocation> | undefined;
    disableGuests?: boolean | undefined;
  };
  export type EventTypeOutput = {
    id: number;
    length: number;
    slug: string;
    title: string;
    description: string | null;
    locations: Array<EventTypeLocation> | null;
  };
  export type CreateEventTypeOutput = { status: "success" | "error"; data: EventTypeOutput };
  export type Data = { eventType: EventTypeOutput };
  export type GetEventTypeOutput = { status: "success" | "error"; data: Data };
  export type EventTypeGroup = { eventTypes: Array<EventTypeOutput> };
  export type GetEventTypesData = { eventTypeGroups: Array<EventTypeGroup> };
  export type GetEventTypesOutput = { status: "success" | "error"; data: GetEventTypesData };
  export type Location = { type: string };
  export type Source = { id: string; type: string; label: string };
  export type BookingField = {
    name: string;
    type: string;
    defaultLabel?: string | undefined;
    label?: string | undefined;
    placeholder?: string | undefined;
    required?: boolean | undefined;
    getOptionsAt?: string | undefined;
    hideWhenJustOneOption?: boolean | undefined;
    editable?: string | undefined;
    sources?: Array<Source> | undefined;
  };
  export type Organization = {
    id: number;
    slug?: string | null | undefined;
    name: string;
    metadata: unknown;
  };
  export type Profile = {
    username: string | null;
    id: number | null;
    userId?: number | undefined;
    uid?: string | undefined;
    name?: string | undefined;
    organizationId: number | null;
    organization?: Organization | null | undefined;
    upId: string;
    image?: string | undefined;
    brandColor?: string | undefined;
    darkBrandColor?: string | undefined;
    theme?: string | undefined;
    bookerLayouts?: unknown | undefined;
  };
  export type Owner = {
    id: number;
    avatarUrl?: string | null | undefined;
    username: string | null;
    name: string | null;
    weekStart: string;
    brandColor?: string | null | undefined;
    darkBrandColor?: string | null | undefined;
    theme?: string | null | undefined;
    metadata: unknown;
    defaultScheduleId?: number | null | undefined;
    nonProfileUsername: string | null;
    profile: Profile;
  };
  export type Schedule = { id: number; timeZone: string | null };
  export type User = {
    username: string | null;
    name: string | null;
    weekStart: string;
    organizationId?: number | undefined;
    avatarUrl?: string | null | undefined;
    profile: Profile;
    bookerUrl: string;
  };
  export type PublicEventTypeOutput = {
    id: number;
    title: string;
    description: string;
    eventName?: string | null | undefined;
    slug: string;
    isInstantEvent: boolean;
    aiPhoneCallConfig?: unknown | undefined;
    schedulingType?: unknown | undefined;
    length: number;
    locations: Array<Location>;
    customInputs: Array<unknown>;
    disableGuests: boolean;
    metadata: unknown | null;
    lockTimeZoneToggleOnBookingPage: boolean;
    requiresConfirmation: boolean;
    requiresBookerEmailVerification: boolean;
    recurringEvent?: unknown | undefined;
    price: number;
    currency: string;
    seatsPerTimeSlot?: number | null | undefined;
    seatsShowAvailabilityCount: boolean | null;
    bookingFields: Array<BookingField>;
    team?: unknown | undefined;
    successRedirectUrl?: string | null | undefined;
    workflows: Array<unknown>;
    hosts: Array<unknown>;
    owner: Owner | null;
    schedule: Schedule | null;
    hidden: boolean;
    assignAllTeamMembers: boolean;
    bookerLayouts?: unknown | undefined;
    users: Array<User>;
    entity: unknown;
    isDynamic: boolean;
  };
  export type GetEventTypePublicOutput = { status: "success" | "error"; data: PublicEventTypeOutput | null };
  export type PublicEventType = {
    id: number;
    length: number;
    slug: string;
    title: string;
    description?: string | null | undefined;
  };
  export type GetEventTypesPublicOutput = { status: "success" | "error"; data: Array<PublicEventType> };
  export type UpdateEventTypeInput = Partial<{
    length: number;
    slug: string;
    title: string;
    description: string;
    hidden: boolean;
    locations: Array<EventTypeLocation>;
    disableGuests: boolean;
  }>;
  export type UpdateEventTypeOutput = { status: "success" | "error"; data: EventTypeOutput };
  export type DeleteData = { id: number; length: number; slug: string; title: string };
  export type DeleteEventTypeOutput = { status: "success" | "error"; data: DeleteData };
  export type CreateAvailabilityInput = { days: Array<number>; startTime: string; endTime: string };
  export type CreateScheduleInput = {
    name: string;
    timeZone: string;
    availabilities?: Array<CreateAvailabilityInput> | undefined;
    isDefault: boolean;
  };
  export type WorkingHours = {
    days: Array<number>;
    startTime: number;
    endTime: number;
    userId?: number | null | undefined;
  };
  export type AvailabilityModel = {
    id: number;
    userId?: number | null | undefined;
    eventTypeId?: number | null | undefined;
    days: Array<number>;
    startTime: string;
    endTime: string;
    date?: string | null | undefined;
    scheduleId?: number | null | undefined;
  };
  export type TimeRange = { userId?: number | null | undefined; start: string; end: string };
  export type ScheduleOutput = {
    id: number;
    name: string;
    isManaged: boolean;
    workingHours: Array<WorkingHours>;
    schedule: Array<AvailabilityModel>;
    availability: Array<Array<TimeRange>>;
    timeZone: string;
    dateOverrides: Array<unknown>;
    isDefault: boolean;
    isLastSchedule: boolean;
    readOnly: boolean;
  };
  export type CreateScheduleOutput = { status: "success" | "error"; data: ScheduleOutput };
  export type GetDefaultScheduleOutput = { status: "success" | "error"; data: ScheduleOutput | null };
  export type GetScheduleOutput = { status: "success" | "error"; data: ScheduleOutput };
  export type GetSchedulesOutput = { status: "success" | "error"; data: ScheduleOutput };
  export type UpdateScheduleInput = {
    timeZone: string;
    name: string;
    isDefault: boolean;
    schedule: Array<Array<any>>;
    dateOverrides?: Array<Array<any>> | undefined;
  };
  export type EventTypeModel = { id: number; eventName?: string | null | undefined };
  export type ScheduleModel = {
    id: number;
    userId: number;
    name: string;
    timeZone?: string | null | undefined;
    eventType?: Array<EventTypeModel> | undefined;
    availability?: Array<AvailabilityModel> | undefined;
  };
  export type UpdatedScheduleOutput = {
    schedule: ScheduleModel;
    isDefault: boolean;
    timeZone?: string | undefined;
    prevDefaultId?: number | null | undefined;
    currentDefaultId?: number | null | undefined;
  };
  export type UpdateScheduleOutput = { status: "success" | "error"; data: UpdatedScheduleOutput };
  export type DeleteScheduleOutput = { status: "success" | "error" };
  export type AuthUrlData = { authUrl: string };
  export type GcalAuthUrlOutput = { status: "success" | "error"; data: AuthUrlData };
  export type GcalSaveRedirectOutput = { url: string };
  export type GcalCheckOutput = { status: "success" | "error" };
  export type ProviderVerifyClientOutput = { status: "success" | "error" };
  export type ProviderVerifyAccessTokenOutput = { status: "success" | "error" };
  export type MeOutput = {
    id: number;
    username: string;
    email: string;
    timeFormat: number;
    defaultScheduleId: number | null;
    weekStart: string;
    timeZone: string;
  };
  export type GetMeOutput = { status: "success" | "error"; data: MeOutput };
  export type UpdateMeOutput = { status: "success" | "error"; data: MeOutput };
  export type BusyTimesOutput = { start: string; end: string; source?: string | null | undefined };
  export type GetBusyTimesOutput = { status: "success" | "error"; data: Array<BusyTimesOutput> };
  export type Integration = {
    appData?: unknown | null | undefined;
    dirName?: string | undefined;
    __template?: string | undefined;
    name: string;
    description: string;
    installed?: boolean | undefined;
    type: string;
    title?: string | undefined;
    variant: string;
    category?: string | undefined;
    categories: Array<string>;
    logo: string;
    publisher: string;
    slug: string;
    url: string;
    email: string;
    locationOption: unknown | null;
  };
  export type Primary = {
    externalId: string;
    integration?: string | undefined;
    name?: string | undefined;
    primary: boolean | null;
    readOnly: boolean;
    email?: string | undefined;
    isSelected: boolean;
    credentialId: number;
  };
  export type Calendar = {
    externalId: string;
    integration?: string | undefined;
    name?: string | undefined;
    primary?: boolean | null | undefined;
    readOnly: boolean;
    email?: string | undefined;
    isSelected: boolean;
    credentialId: number;
  };
  export type ConnectedCalendar = {
    integration: Integration;
    credentialId: number;
    primary?: Primary | undefined;
    calendars?: Array<Calendar> | undefined;
  };
  export type DestinationCalendar = {
    id: number;
    integration: string;
    externalId: string;
    primaryEmail: string | null;
    userId: number | null;
    eventTypeId: number | null;
    credentialId: number | null;
    name?: string | null | undefined;
    primary?: boolean | undefined;
    readOnly?: boolean | undefined;
    email?: string | undefined;
    integrationTitle?: string | undefined;
  };
  export type ConnectedCalendarsData = {
    connectedCalendars: Array<ConnectedCalendar>;
    destinationCalendar: DestinationCalendar;
  };
  export type ConnectedCalendarsOutput = { status: "success" | "error"; data: ConnectedCalendarsData };
  export type Attendee = {
    id: number;
    email: string;
    name: string;
    timeZone: string;
    locale: string | null;
    bookingId: number | null;
  };
  export type EventType = {
    slug?: string | undefined;
    id?: number | undefined;
    eventName?: string | null | undefined;
    price: number;
    recurringEvent?: unknown | undefined;
    currency: string;
    metadata: unknown;
    seatsShowAttendees?: unknown | undefined;
    seatsShowAvailabilityCount?: unknown | undefined;
    team?: unknown | null | undefined;
  };
  export type Reference = {
    id: number;
    type: string;
    uid: string;
    meetingId?: string | null | undefined;
    thirdPartyRecurringEventId?: string | null | undefined;
    meetingPassword: string | null;
    meetingUrl?: string | null | undefined;
    bookingId: number | null;
    externalCalendarId: string | null;
    deleted?: unknown | undefined;
    credentialId: number | null;
  };
  export type GetBookingsDataEntry = {
    id: number;
    title: string;
    userPrimaryEmail?: string | null | undefined;
    description: string | null;
    customInputs: unknown;
    startTime: string;
    endTime: string;
    attendees: Array<Attendee>;
    metadata: unknown;
    uid: string;
    recurringEventId: string | null;
    location: string | null;
    eventType: EventType;
    status: unknown;
    paid: boolean;
    payment: Array<unknown>;
    references: Array<Reference>;
    isRecorded: boolean;
    seatsReferences: Array<unknown>;
    user: User | null;
    rescheduled?: unknown | undefined;
  };
  export type GetBookingsData = {
    bookings: Array<GetBookingsDataEntry>;
    recurringInfo: Array<unknown>;
    nextCursor: number | null;
  };
  export type GetBookingsOutput = { status: "success" | "error"; data: GetBookingsData };
  export type GetBookingData = {
    title: string;
    id: number;
    uid: string;
    description: string | null;
    customInputs: unknown;
    smsReminderNumber: string | null;
    recurringEventId: string | null;
    startTime: string;
    endTime: string;
    location: string | null;
    status: string;
    metadata: unknown;
    cancellationReason: string | null;
    responses: unknown;
    rejectionReason: string | null;
    userPrimaryEmail: string | null;
    user: User | null;
    attendees: Array<Attendee>;
    eventTypeId: number | null;
    eventType: EventType | null;
  };
  export type GetBookingOutput = { status: "success" | "error"; data: GetBookingData };
  export type Response = {
    name: string;
    email: string;
    guests: Array<string>;
    location?: Location | undefined;
    notes?: string | undefined;
  };
  export type CreateBookingInput = {
    end?: string | undefined;
    start: string;
    eventTypeId: number;
    eventTypeSlug?: string | undefined;
    rescheduleUid?: string | undefined;
    recurringEventId?: string | undefined;
    timeZone: string;
    user?: Array<string> | undefined;
    language: string;
    bookingUid?: string | undefined;
    metadata: unknown;
    hasHashedBookingLink?: boolean | undefined;
    hashedLink: string | null;
    seatReferenceUid?: string | undefined;
    responses: Response;
    orgSlug?: string | undefined;
    locationUrl?: string | undefined;
  };
  export type CancelBookingInput = {
    id: number;
    uid: string;
    allRemainingBookings: boolean;
    cancellationReason: string;
    seatReferenceUid: string;
  };
  export type ReserveSlotInput = Partial<{}>;

  // </Schemas>
}

export namespace Endpoints {
  // <Endpoints>

  export type get_BookingsController_getBookings = {
    method: "GET";
    path: "/v2/bookings";
    parameters: {
      query: {
        cursor: number;
        limit: number;
        "filters[status]": "upcoming" | "recurring" | "past" | "cancelled" | "unconfirmed";
      };
    };
    response: Schemas.GetBookingsOutput;
  };
  export type post_BookingsController_createBooking = {
    method: "POST";
    path: "/v2/bookings";
    parameters: {
      header: { "x-cal-client-id": string };
      body: Schemas.CreateBookingInput;
    };
    response: unknown;
  };
  export type get_BookingsController_getBooking = {
    method: "GET";
    path: "/v2/bookings/{bookingUid}";
    parameters: {
      path: { bookingUid: string };
    };
    response: Schemas.GetBookingOutput;
  };
  export type get_BookingsController_getBookingForReschedule = {
    method: "GET";
    path: "/v2/bookings/{bookingUid}/reschedule";
    parameters: {
      path: { bookingUid: string };
    };
    response: unknown;
  };
  export type post_BookingsController_cancelBooking = {
    method: "POST";
    path: "/v2/bookings/{bookingId}/cancel";
    parameters: {
      path: { bookingId: string };
      header: { "x-cal-client-id": string };
      body: Schemas.CancelBookingInput;
    };
    response: unknown;
  };
  export type post_BookingsController_createRecurringBooking = {
    method: "POST";
    path: "/v2/bookings/recurring";
    parameters: {
      header: { "x-cal-client-id": string };
      body: Array<string>;
    };
    response: unknown;
  };
  export type post_BookingsController_createInstantBooking = {
    method: "POST";
    path: "/v2/bookings/instant";
    parameters: {
      header: { "x-cal-client-id": string };
      body: Schemas.CreateBookingInput;
    };
    response: unknown;
  };

  // </Endpoints>
}

// <EndpointByMethod>
export type EndpointByMethod = {
  get: {
    "/v2/bookings": Endpoints.get_BookingsController_getBookings;
    "/v2/bookings/{bookingUid}": Endpoints.get_BookingsController_getBooking;
    "/v2/bookings/{bookingUid}/reschedule": Endpoints.get_BookingsController_getBookingForReschedule;
  };
  post: {
    "/v2/bookings": Endpoints.post_BookingsController_createBooking;
    "/v2/bookings/{bookingId}/cancel": Endpoints.post_BookingsController_cancelBooking;
    "/v2/bookings/recurring": Endpoints.post_BookingsController_createRecurringBooking;
    "/v2/bookings/instant": Endpoints.post_BookingsController_createInstantBooking;
  };
};

// </EndpointByMethod>

// <EndpointByMethod.Shorthands>
export type GetEndpoints = EndpointByMethod["get"];
export type PostEndpoints = EndpointByMethod["post"];
export type AllEndpoints = EndpointByMethod[keyof EndpointByMethod];
// </EndpointByMethod.Shorthands>

// <ApiClientTypes>
export type EndpointParameters = {
  body?: unknown;
  query?: Record<string, unknown>;
  header?: Record<string, unknown>;
  path?: Record<string, unknown>;
};

export type MutationMethod = "post" | "put" | "patch" | "delete";
export type Method = "get" | "head" | MutationMethod;

export type DefaultEndpoint = {
  parameters?: EndpointParameters | undefined;
  response: unknown;
};

export type Endpoint<TConfig extends DefaultEndpoint = DefaultEndpoint> = {
  operationId: string;
  method: Method;
  path: string;
  parameters?: TConfig["parameters"];
  meta: {
    alias: string;
    hasParameters: boolean;
    areParametersRequired: boolean;
  };
  response: TConfig["response"];
};

type Fetcher = (
  method: Method,
  url: string,
  parameters?: EndpointParameters | undefined
) => Promise<Endpoint["response"]>;

type RequiredKeys<T> = {
  [P in keyof T]-?: undefined extends T[P] ? never : P;
}[keyof T];

type MaybeOptionalArg<T> = RequiredKeys<T> extends never ? [config?: T] : [config: T];

// </ApiClientTypes>

// <ApiClient>
export class ApiClient {
  baseUrl = "";

  constructor(public fetcher: Fetcher) {}

  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
    return this;
  }

  // <ApiClient.get>
  get<Path extends keyof GetEndpoints, TEndpoint extends GetEndpoints[Path]>(
    path: Path,
    ...params: MaybeOptionalArg<TEndpoint["parameters"]>
  ): Promise<TEndpoint["response"]> {
    return this.fetcher("get", this.baseUrl + path, params[0]);
  }
  // </ApiClient.get>

  // <ApiClient.post>
  post<Path extends keyof PostEndpoints, TEndpoint extends PostEndpoints[Path]>(
    path: Path,
    ...params: MaybeOptionalArg<TEndpoint["parameters"]>
  ): Promise<TEndpoint["response"]> {
    return this.fetcher("post", this.baseUrl + path, params[0]);
  }
  // </ApiClient.post>
}

export function createApiClient(fetcher: Fetcher, baseUrl?: string) {
  return new ApiClient(fetcher).setBaseUrl(baseUrl ?? "");
}

/**
 Example usage:
 const api = createApiClient((method, url, params) =>
   fetch(url, { method, body: JSON.stringify(params) }).then((res) => res.json()),
 );
 api.get("/users").then((users) => console.log(users));
 api.post("/users", { body: { name: "John" } }).then((user) => console.log(user));
 api.put("/users/:id", { path: { id: 1 }, body: { name: "John" } }).then((user) => console.log(user));
*/

// </ApiClient

// @ts-nocheck generated file
import z from "zod";

export type ManagedUserOutput = z.infer<typeof ManagedUserOutput>;
export const ManagedUserOutput = z.object({
  id: z.number(),
  email: z.string(),
  username: z.union([z.string(), z.null()]),
  timeZone: z.string(),
  weekStart: z.string(),
  createdDate: z.string(),
  timeFormat: z.union([z.number(), z.null()]),
  defaultScheduleId: z.union([z.number(), z.null()]),
});

export type GetManagedUsersOutput = z.infer<typeof GetManagedUsersOutput>;
export const GetManagedUsersOutput = z.object({
  status: z.union([z.literal("success"), z.literal("error")]),
  data: z.array(ManagedUserOutput),
});

export type CreateManagedUserInput = z.infer<typeof CreateManagedUserInput>;
export const CreateManagedUserInput = z.object({
  email: z.string(),
  timeFormat: z.union([z.literal(12), z.literal(24), z.undefined()]).optional(),
  weekStart: z
    .union([
      z.literal("Monday"),
      z.literal("Tuesday"),
      z.literal("Wednesday"),
      z.literal("Thursday"),
      z.literal("Friday"),
      z.literal("Saturday"),
      z.literal("Sunday"),
      z.undefined(),
    ])
    .optional(),
  timeZone: z.union([z.string(), z.undefined()]).optional(),
  name: z.union([z.string(), z.undefined()]).optional(),
});

export type CreateManagedUserData = z.infer<typeof CreateManagedUserData>;
export const CreateManagedUserData = z.object({
  user: ManagedUserOutput,
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type CreateManagedUserOutput = z.infer<typeof CreateManagedUserOutput>;
export const CreateManagedUserOutput = z.object({
  status: z.union([z.literal("success"), z.literal("error")]),
  data: CreateManagedUserData,
});

export type GetManagedUserOutput = z.infer<typeof GetManagedUserOutput>;
export const GetManagedUserOutput = z.object({
  status: z.union([z.literal("success"), z.literal("error")]),
  data: ManagedUserOutput,
});

export type UpdateManagedUserInput = z.infer<typeof UpdateManagedUserInput>;
export const UpdateManagedUserInput = z.object({
  timeFormat: z.union([z.literal(12), z.literal(24)]).optional(),
  weekStart: z
    .union([
      z.literal("Monday"),
      z.literal("Tuesday"),
      z.literal("Wednesday"),
      z.literal("Thursday"),
      z.literal("Friday"),
      z.literal("Saturday"),
      z.literal("Sunday"),
    ])
    .optional(),
  email: z.string().optional(),
  name: z.string().optional(),
  defaultScheduleId: z.number().optional(),
  timeZone: z.string().optional(),
});

export type KeysDto = z.infer<typeof KeysDto>;
export const KeysDto = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type KeysResponseDto = z.infer<typeof KeysResponseDto>;
export const KeysResponseDto = z.object({
  status: z.union([z.literal("success"), z.literal("error")]),
  data: KeysDto,
});

export type CreateOAuthClientInput = z.infer<typeof CreateOAuthClientInput>;
export const CreateOAuthClientInput = z.object({});

export type DataDto = z.infer<typeof DataDto>;
export const DataDto = z.object({
  clientId: z.string(),
  clientSecret: z.string(),
});

export type CreateOAuthClientResponseDto = z.infer<typeof CreateOAuthClientResponseDto>;
export const CreateOAuthClientResponseDto = z.object({
  status: z.union([z.literal("success"), z.literal("error")]),
  data: DataDto,
});

export type PlatformOAuthClientDto = z.infer<typeof PlatformOAuthClientDto>;
export const PlatformOAuthClientDto = z.object({
  id: z.string(),
  name: z.string(),
  secret: z.string(),
  permissions: z.number(),
  logo: z.union([z.string(), z.null(), z.undefined()]).optional(),
  redirectUris: z.array(z.string()),
  organizationId: z.number(),
  createdAt: z.string(),
});

export type GetOAuthClientsResponseDto = z.infer<typeof GetOAuthClientsResponseDto>;
export const GetOAuthClientsResponseDto = z.object({
  status: z.union([z.literal("success"), z.literal("error")]),
  data: z.array(PlatformOAuthClientDto),
});

export type GetOAuthClientResponseDto = z.infer<typeof GetOAuthClientResponseDto>;
export const GetOAuthClientResponseDto = z.object({
  status: z.union([z.literal("success"), z.literal("error")]),
  data: PlatformOAuthClientDto,
});

export type UpdateOAuthClientInput = z.infer<typeof UpdateOAuthClientInput>;
export const UpdateOAuthClientInput = z.object({
  logo: z.string().optional(),
  name: z.string().optional(),
  redirectUris: z.array(z.string()).optional(),
  bookingRedirectUri: z.string().optional(),
  bookingCancelRedirectUri: z.string().optional(),
  bookingRescheduleRedirectUri: z.string().optional(),
  areEmailsEnabled: z.boolean().optional(),
});

export type OAuthAuthorizeInput = z.infer<typeof OAuthAuthorizeInput>;
export const OAuthAuthorizeInput = z.object({
  redirectUri: z.string(),
});

export type ExchangeAuthorizationCodeInput = z.infer<typeof ExchangeAuthorizationCodeInput>;
export const ExchangeAuthorizationCodeInput = z.object({
  clientSecret: z.string(),
});

export type RefreshTokenInput = z.infer<typeof RefreshTokenInput>;
export const RefreshTokenInput = z.object({
  refreshToken: z.string(),
});

export type EventTypeLocation = z.infer<typeof EventTypeLocation>;
export const EventTypeLocation = z.object({
  type: z.string(),
  link: z.union([z.string(), z.undefined()]).optional(),
});

export type CreateEventTypeInput = z.infer<typeof CreateEventTypeInput>;
export const CreateEventTypeInput = z.object({
  length: z.number(),
  slug: z.string(),
  title: z.string(),
  description: z.union([z.string(), z.undefined()]).optional(),
  locations: z.union([z.array(EventTypeLocation), z.undefined()]).optional(),
  disableGuests: z.union([z.boolean(), z.undefined()]).optional(),
});

export type EventTypeOutput = z.infer<typeof EventTypeOutput>;
export const EventTypeOutput = z.object({
  id: z.number(),
  length: z.number(),
  slug: z.string(),
  title: z.string(),
  description: z.union([z.string(), z.null()]),
  locations: z.union([z.array(EventTypeLocation), z.null()]),
});

export type CreateEventTypeOutput = z.infer<typeof CreateEventTypeOutput>;
export const CreateEventTypeOutput = z.object({
  status: z.union([z.literal("success"), z.literal("error")]),
  data: EventTypeOutput,
});

export type Data = z.infer<typeof Data>;
export const Data = z.object({
  eventType: EventTypeOutput,
});

export type GetEventTypeOutput = z.infer<typeof GetEventTypeOutput>;
export const GetEventTypeOutput = z.object({
  status: z.union([z.literal("success"), z.literal("error")]),
  data: Data,
});

export type EventTypeGroup = z.infer<typeof EventTypeGroup>;
export const EventTypeGroup = z.object({
  eventTypes: z.array(EventTypeOutput),
});

export type GetEventTypesData = z.infer<typeof GetEventTypesData>;
export const GetEventTypesData = z.object({
  eventTypeGroups: z.array(EventTypeGroup),
});

export type GetEventTypesOutput = z.infer<typeof GetEventTypesOutput>;
export const GetEventTypesOutput = z.object({
  status: z.union([z.literal("success"), z.literal("error")]),
  data: GetEventTypesData,
});

export type Location = z.infer<typeof Location>;
export const Location = z.object({
  type: z.string(),
});

export type Source = z.infer<typeof Source>;
export const Source = z.object({
  id: z.string(),
  type: z.string(),
  label: z.string(),
});

export type BookingField = z.infer<typeof BookingField>;
export const BookingField = z.object({
  name: z.string(),
  type: z.string(),
  defaultLabel: z.union([z.string(), z.undefined()]).optional(),
  label: z.union([z.string(), z.undefined()]).optional(),
  placeholder: z.union([z.string(), z.undefined()]).optional(),
  required: z.union([z.boolean(), z.undefined()]).optional(),
  getOptionsAt: z.union([z.string(), z.undefined()]).optional(),
  hideWhenJustOneOption: z.union([z.boolean(), z.undefined()]).optional(),
  editable: z.union([z.string(), z.undefined()]).optional(),
  sources: z.union([z.array(Source), z.undefined()]).optional(),
});

export type Organization = z.infer<typeof Organization>;
export const Organization = z.object({
  id: z.number(),
  slug: z.union([z.string(), z.null(), z.undefined()]).optional(),
  name: z.string(),
  metadata: z.unknown(),
});

export type Profile = z.infer<typeof Profile>;
export const Profile = z.object({
  username: z.union([z.string(), z.null()]),
  id: z.union([z.number(), z.null()]),
  userId: z.union([z.number(), z.undefined()]).optional(),
  uid: z.union([z.string(), z.undefined()]).optional(),
  name: z.union([z.string(), z.undefined()]).optional(),
  organizationId: z.union([z.number(), z.null()]),
  organization: z.union([Organization, z.null(), z.undefined()]).optional(),
  upId: z.string(),
  image: z.union([z.string(), z.undefined()]).optional(),
  brandColor: z.union([z.string(), z.undefined()]).optional(),
  darkBrandColor: z.union([z.string(), z.undefined()]).optional(),
  theme: z.union([z.string(), z.undefined()]).optional(),
  bookerLayouts: z.union([z.unknown(), z.undefined()]).optional(),
});

export type Owner = z.infer<typeof Owner>;
export const Owner = z.object({
  id: z.number(),
  avatarUrl: z.union([z.string(), z.null(), z.undefined()]).optional(),
  username: z.union([z.string(), z.null()]),
  name: z.union([z.string(), z.null()]),
  weekStart: z.string(),
  brandColor: z.union([z.string(), z.null(), z.undefined()]).optional(),
  darkBrandColor: z.union([z.string(), z.null(), z.undefined()]).optional(),
  theme: z.union([z.string(), z.null(), z.undefined()]).optional(),
  metadata: z.unknown(),
  defaultScheduleId: z.union([z.number(), z.null(), z.undefined()]).optional(),
  nonProfileUsername: z.union([z.string(), z.null()]),
  profile: Profile,
});

export type Schedule = z.infer<typeof Schedule>;
export const Schedule = z.object({
  id: z.number(),
  timeZone: z.union([z.string(), z.null()]),
});

export type User = z.infer<typeof User>;
export const User = z.object({
  username: z.union([z.string(), z.null()]),
  name: z.union([z.string(), z.null()]),
  weekStart: z.string(),
  organizationId: z.union([z.number(), z.undefined()]).optional(),
  avatarUrl: z.union([z.string(), z.null(), z.undefined()]).optional(),
  profile: Profile,
  bookerUrl: z.string(),
});

export type PublicEventTypeOutput = z.infer<typeof PublicEventTypeOutput>;
export const PublicEventTypeOutput = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  eventName: z.union([z.string(), z.null(), z.undefined()]).optional(),
  slug: z.string(),
  isInstantEvent: z.boolean(),
  aiPhoneCallConfig: z.union([z.unknown(), z.undefined()]).optional(),
  schedulingType: z.union([z.unknown(), z.undefined()]).optional(),
  length: z.number(),
  locations: z.array(Location),
  customInputs: z.array(z.unknown()),
  disableGuests: z.boolean(),
  metadata: z.union([z.unknown(), z.null()]),
  lockTimeZoneToggleOnBookingPage: z.boolean(),
  requiresConfirmation: z.boolean(),
  requiresBookerEmailVerification: z.boolean(),
  recurringEvent: z.union([z.unknown(), z.undefined()]).optional(),
  price: z.number(),
  currency: z.string(),
  seatsPerTimeSlot: z.union([z.number(), z.null(), z.undefined()]).optional(),
  seatsShowAvailabilityCount: z.union([z.boolean(), z.null()]),
  bookingFields: z.array(BookingField),
  team: z.union([z.unknown(), z.undefined()]).optional(),
  successRedirectUrl: z.union([z.string(), z.null(), z.undefined()]).optional(),
  workflows: z.array(z.unknown()),
  hosts: z.array(z.unknown()),
  owner: z.union([Owner, z.null()]),
  schedule: z.union([Schedule, z.null()]),
  hidden: z.boolean(),
  assignAllTeamMembers: z.boolean(),
  bookerLayouts: z.union([z.unknown(), z.undefined()]).optional(),
  users: z.array(User),
  entity: z.unknown(),
  isDynamic: z.boolean(),
});

export type GetEventTypePublicOutput = z.infer<typeof GetEventTypePublicOutput>;
export const GetEventTypePublicOutput = z.object({
  status: z.union([z.literal("success"), z.literal("error")]),
  data: z.union([PublicEventTypeOutput, z.null()]),
});

export type PublicEventType = z.infer<typeof PublicEventType>;
export const PublicEventType = z.object({
  id: z.number(),
  length: z.number(),
  slug: z.string(),
  title: z.string(),
  description: z.union([z.string(), z.null(), z.undefined()]).optional(),
});

export type GetEventTypesPublicOutput = z.infer<typeof GetEventTypesPublicOutput>;
export const GetEventTypesPublicOutput = z.object({
  status: z.union([z.literal("success"), z.literal("error")]),
  data: z.array(PublicEventType),
});

export type UpdateEventTypeInput = z.infer<typeof UpdateEventTypeInput>;
export const UpdateEventTypeInput = z.object({
  length: z.number().optional(),
  slug: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  hidden: z.boolean().optional(),
  locations: z.array(EventTypeLocation).optional(),
  disableGuests: z.boolean().optional(),
});

export type UpdateEventTypeOutput = z.infer<typeof UpdateEventTypeOutput>;
export const UpdateEventTypeOutput = z.object({
  status: z.union([z.literal("success"), z.literal("error")]),
  data: EventTypeOutput,
});

export type DeleteData = z.infer<typeof DeleteData>;
export const DeleteData = z.object({
  id: z.number(),
  length: z.number(),
  slug: z.string(),
  title: z.string(),
});

export type DeleteEventTypeOutput = z.infer<typeof DeleteEventTypeOutput>;
export const DeleteEventTypeOutput = z.object({
  status: z.union([z.literal("success"), z.literal("error")]),
  data: DeleteData,
});

export type CreateAvailabilityInput = z.infer<typeof CreateAvailabilityInput>;
export const CreateAvailabilityInput = z.object({
  days: z.array(z.number()),
  startTime: z.string(),
  endTime: z.string(),
});

export type CreateScheduleInput = z.infer<typeof CreateScheduleInput>;
export const CreateScheduleInput = z.object({
  name: z.string(),
  timeZone: z.string(),
  availabilities: z.union([z.array(CreateAvailabilityInput), z.undefined()]).optional(),
  isDefault: z.boolean(),
});

export type WorkingHours = z.infer<typeof WorkingHours>;
export const WorkingHours = z.object({
  days: z.array(z.number()),
  startTime: z.number(),
  endTime: z.number(),
  userId: z.union([z.number(), z.null(), z.undefined()]).optional(),
});

export type AvailabilityModel = z.infer<typeof AvailabilityModel>;
export const AvailabilityModel = z.object({
  id: z.number(),
  userId: z.union([z.number(), z.null(), z.undefined()]).optional(),
  eventTypeId: z.union([z.number(), z.null(), z.undefined()]).optional(),
  days: z.array(z.number()),
  startTime: z.string(),
  endTime: z.string(),
  date: z.union([z.string(), z.null(), z.undefined()]).optional(),
  scheduleId: z.union([z.number(), z.null(), z.undefined()]).optional(),
});

export type TimeRange = z.infer<typeof TimeRange>;
export const TimeRange = z.object({
  userId: z.union([z.number(), z.null(), z.undefined()]).optional(),
  start: z.string(),
  end: z.string(),
});

export type ScheduleOutput = z.infer<typeof ScheduleOutput>;
export const ScheduleOutput = z.object({
  id: z.number(),
  name: z.string(),
  isManaged: z.boolean(),
  workingHours: z.array(WorkingHours),
  schedule: z.array(AvailabilityModel),
  availability: z.array(z.array(TimeRange)),
  timeZone: z.string(),
  dateOverrides: z.array(z.unknown()),
  isDefault: z.boolean(),
  isLastSchedule: z.boolean(),
  readOnly: z.boolean(),
});

export type CreateScheduleOutput = z.infer<typeof CreateScheduleOutput>;
export const CreateScheduleOutput = z.object({
  status: z.union([z.literal("success"), z.literal("error")]),
  data: ScheduleOutput,
});

export type GetDefaultScheduleOutput = z.infer<typeof GetDefaultScheduleOutput>;
export const GetDefaultScheduleOutput = z.object({
  status: z.union([z.literal("success"), z.literal("error")]),
  data: z.union([ScheduleOutput, z.null()]),
});

export type GetScheduleOutput = z.infer<typeof GetScheduleOutput>;
export const GetScheduleOutput = z.object({
  status: z.union([z.literal("success"), z.literal("error")]),
  data: ScheduleOutput,
});

export type GetSchedulesOutput = z.infer<typeof GetSchedulesOutput>;
export const GetSchedulesOutput = z.object({
  status: z.union([z.literal("success"), z.literal("error")]),
  data: ScheduleOutput,
});

export type UpdateScheduleInput = z.infer<typeof UpdateScheduleInput>;
export const UpdateScheduleInput = z.object({
  timeZone: z.string(),
  name: z.string(),
  isDefault: z.boolean(),
  schedule: z.array(z.array(z.any())),
  dateOverrides: z.union([z.array(z.array(z.any())), z.undefined()]).optional(),
});

export type EventTypeModel = z.infer<typeof EventTypeModel>;
export const EventTypeModel = z.object({
  id: z.number(),
  eventName: z.union([z.string(), z.null(), z.undefined()]).optional(),
});

export type ScheduleModel = z.infer<typeof ScheduleModel>;
export const ScheduleModel = z.object({
  id: z.number(),
  userId: z.number(),
  name: z.string(),
  timeZone: z.union([z.string(), z.null(), z.undefined()]).optional(),
  eventType: z.union([z.array(EventTypeModel), z.undefined()]).optional(),
  availability: z.union([z.array(AvailabilityModel), z.undefined()]).optional(),
});

export type UpdatedScheduleOutput = z.infer<typeof UpdatedScheduleOutput>;
export const UpdatedScheduleOutput = z.object({
  schedule: ScheduleModel,
  isDefault: z.boolean(),
  timeZone: z.union([z.string(), z.undefined()]).optional(),
  prevDefaultId: z.union([z.number(), z.null(), z.undefined()]).optional(),
  currentDefaultId: z.union([z.number(), z.null(), z.undefined()]).optional(),
});

export type UpdateScheduleOutput = z.infer<typeof UpdateScheduleOutput>;
export const UpdateScheduleOutput = z.object({
  status: z.union([z.literal("success"), z.literal("error")]),
  data: UpdatedScheduleOutput,
});

export type DeleteScheduleOutput = z.infer<typeof DeleteScheduleOutput>;
export const DeleteScheduleOutput = z.object({
  status: z.union([z.literal("success"), z.literal("error")]),
});

export type AuthUrlData = z.infer<typeof AuthUrlData>;
export const AuthUrlData = z.object({
  authUrl: z.string(),
});

export type GcalAuthUrlOutput = z.infer<typeof GcalAuthUrlOutput>;
export const GcalAuthUrlOutput = z.object({
  status: z.union([z.literal("success"), z.literal("error")]),
  data: AuthUrlData,
});

export type GcalSaveRedirectOutput = z.infer<typeof GcalSaveRedirectOutput>;
export const GcalSaveRedirectOutput = z.object({
  url: z.string(),
});

export type GcalCheckOutput = z.infer<typeof GcalCheckOutput>;
export const GcalCheckOutput = z.object({
  status: z.union([z.literal("success"), z.literal("error")]),
});

export type ProviderVerifyClientOutput = z.infer<typeof ProviderVerifyClientOutput>;
export const ProviderVerifyClientOutput = z.object({
  status: z.union([z.literal("success"), z.literal("error")]),
});

export type ProviderVerifyAccessTokenOutput = z.infer<typeof ProviderVerifyAccessTokenOutput>;
export const ProviderVerifyAccessTokenOutput = z.object({
  status: z.union([z.literal("success"), z.literal("error")]),
});

export type MeOutput = z.infer<typeof MeOutput>;
export const MeOutput = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  timeFormat: z.number(),
  defaultScheduleId: z.union([z.number(), z.null()]),
  weekStart: z.string(),
  timeZone: z.string(),
});

export type GetMeOutput = z.infer<typeof GetMeOutput>;
export const GetMeOutput = z.object({
  status: z.union([z.literal("success"), z.literal("error")]),
  data: MeOutput,
});

export type UpdateMeOutput = z.infer<typeof UpdateMeOutput>;
export const UpdateMeOutput = z.object({
  status: z.union([z.literal("success"), z.literal("error")]),
  data: MeOutput,
});

export type BusyTimesOutput = z.infer<typeof BusyTimesOutput>;
export const BusyTimesOutput = z.object({
  start: z.string(),
  end: z.string(),
  source: z.union([z.string(), z.null(), z.undefined()]).optional(),
});

export type GetBusyTimesOutput = z.infer<typeof GetBusyTimesOutput>;
export const GetBusyTimesOutput = z.object({
  status: z.union([z.literal("success"), z.literal("error")]),
  data: z.array(BusyTimesOutput),
});

export type Integration = z.infer<typeof Integration>;
export const Integration = z.object({
  appData: z.union([z.unknown(), z.null(), z.undefined()]).optional(),
  dirName: z.union([z.string(), z.undefined()]).optional(),
  __template: z.union([z.string(), z.undefined()]).optional(),
  name: z.string(),
  description: z.string(),
  installed: z.union([z.boolean(), z.undefined()]).optional(),
  type: z.string(),
  title: z.union([z.string(), z.undefined()]).optional(),
  variant: z.string(),
  category: z.union([z.string(), z.undefined()]).optional(),
  categories: z.array(z.string()),
  logo: z.string(),
  publisher: z.string(),
  slug: z.string(),
  url: z.string(),
  email: z.string(),
  locationOption: z.union([z.unknown(), z.null()]),
});

export type Primary = z.infer<typeof Primary>;
export const Primary = z.object({
  externalId: z.string(),
  integration: z.union([z.string(), z.undefined()]).optional(),
  name: z.union([z.string(), z.undefined()]).optional(),
  primary: z.union([z.boolean(), z.null()]),
  readOnly: z.boolean(),
  email: z.union([z.string(), z.undefined()]).optional(),
  isSelected: z.boolean(),
  credentialId: z.number(),
});

export type Calendar = z.infer<typeof Calendar>;
export const Calendar = z.object({
  externalId: z.string(),
  integration: z.union([z.string(), z.undefined()]).optional(),
  name: z.union([z.string(), z.undefined()]).optional(),
  primary: z.union([z.boolean(), z.null(), z.undefined()]).optional(),
  readOnly: z.boolean(),
  email: z.union([z.string(), z.undefined()]).optional(),
  isSelected: z.boolean(),
  credentialId: z.number(),
});

export type ConnectedCalendar = z.infer<typeof ConnectedCalendar>;
export const ConnectedCalendar = z.object({
  integration: Integration,
  credentialId: z.number(),
  primary: z.union([Primary, z.undefined()]).optional(),
  calendars: z.union([z.array(Calendar), z.undefined()]).optional(),
});

export type DestinationCalendar = z.infer<typeof DestinationCalendar>;
export const DestinationCalendar = z.object({
  id: z.number(),
  integration: z.string(),
  externalId: z.string(),
  primaryEmail: z.union([z.string(), z.null()]),
  userId: z.union([z.number(), z.null()]),
  eventTypeId: z.union([z.number(), z.null()]),
  credentialId: z.union([z.number(), z.null()]),
  name: z.union([z.string(), z.null(), z.undefined()]).optional(),
  primary: z.union([z.boolean(), z.undefined()]).optional(),
  readOnly: z.union([z.boolean(), z.undefined()]).optional(),
  email: z.union([z.string(), z.undefined()]).optional(),
  integrationTitle: z.union([z.string(), z.undefined()]).optional(),
});

export type ConnectedCalendarsData = z.infer<typeof ConnectedCalendarsData>;
export const ConnectedCalendarsData = z.object({
  connectedCalendars: z.array(ConnectedCalendar),
  destinationCalendar: DestinationCalendar,
});

export type ConnectedCalendarsOutput = z.infer<typeof ConnectedCalendarsOutput>;
export const ConnectedCalendarsOutput = z.object({
  status: z.union([z.literal("success"), z.literal("error")]),
  data: ConnectedCalendarsData,
});

export type Attendee = z.infer<typeof Attendee>;
export const Attendee = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string(),
  timeZone: z.string(),
  locale: z.union([z.string(), z.null()]),
  bookingId: z.union([z.number(), z.null()]),
});

export type EventType = z.infer<typeof EventType>;
export const EventType = z.object({
  slug: z.union([z.string(), z.undefined()]).optional(),
  id: z.union([z.number(), z.undefined()]).optional(),
  eventName: z.union([z.string(), z.null(), z.undefined()]).optional(),
  price: z.number(),
  recurringEvent: z.union([z.unknown(), z.undefined()]).optional(),
  currency: z.string(),
  metadata: z.unknown(),
  seatsShowAttendees: z.union([z.unknown(), z.undefined()]).optional(),
  seatsShowAvailabilityCount: z.union([z.unknown(), z.undefined()]).optional(),
  team: z.union([z.unknown(), z.null(), z.undefined()]).optional(),
});

export type Reference = z.infer<typeof Reference>;
export const Reference = z.object({
  id: z.number(),
  type: z.string(),
  uid: z.string(),
  meetingId: z.union([z.string(), z.null(), z.undefined()]).optional(),
  thirdPartyRecurringEventId: z.union([z.string(), z.null(), z.undefined()]).optional(),
  meetingPassword: z.union([z.string(), z.null()]),
  meetingUrl: z.union([z.string(), z.null(), z.undefined()]).optional(),
  bookingId: z.union([z.number(), z.null()]),
  externalCalendarId: z.union([z.string(), z.null()]),
  deleted: z.union([z.unknown(), z.undefined()]).optional(),
  credentialId: z.union([z.number(), z.null()]),
});

export type GetBookingsDataEntry = z.infer<typeof GetBookingsDataEntry>;
export const GetBookingsDataEntry = z.object({
  id: z.number(),
  title: z.string(),
  userPrimaryEmail: z.union([z.string(), z.null(), z.undefined()]).optional(),
  description: z.union([z.string(), z.null()]),
  customInputs: z.unknown(),
  startTime: z.string(),
  endTime: z.string(),
  attendees: z.array(Attendee),
  metadata: z.unknown(),
  uid: z.string(),
  recurringEventId: z.union([z.string(), z.null()]),
  location: z.union([z.string(), z.null()]),
  eventType: EventType,
  status: z.unknown(),
  paid: z.boolean(),
  payment: z.array(z.unknown()),
  references: z.array(Reference),
  isRecorded: z.boolean(),
  seatsReferences: z.array(z.unknown()),
  user: z.union([User, z.null()]),
  rescheduled: z.union([z.unknown(), z.undefined()]).optional(),
});

export type GetBookingsData = z.infer<typeof GetBookingsData>;
export const GetBookingsData = z.object({
  bookings: z.array(GetBookingsDataEntry),
  recurringInfo: z.array(z.unknown()),
  nextCursor: z.union([z.number(), z.null()]),
});

export type GetBookingsOutput = z.infer<typeof GetBookingsOutput>;
export const GetBookingsOutput = z.object({
  status: z.union([z.literal("success"), z.literal("error")]),
  data: GetBookingsData,
});

export type GetBookingData = z.infer<typeof GetBookingData>;
export const GetBookingData = z.object({
  title: z.string(),
  id: z.number(),
  uid: z.string(),
  description: z.union([z.string(), z.null()]),
  customInputs: z.unknown(),
  smsReminderNumber: z.union([z.string(), z.null()]),
  recurringEventId: z.union([z.string(), z.null()]),
  startTime: z.string(),
  endTime: z.string(),
  location: z.union([z.string(), z.null()]),
  status: z.string(),
  metadata: z.unknown(),
  cancellationReason: z.union([z.string(), z.null()]),
  responses: z.unknown(),
  rejectionReason: z.union([z.string(), z.null()]),
  userPrimaryEmail: z.union([z.string(), z.null()]),
  user: z.union([User, z.null()]),
  attendees: z.array(Attendee),
  eventTypeId: z.union([z.number(), z.null()]),
  eventType: z.union([EventType, z.null()]),
});

export type GetBookingOutput = z.infer<typeof GetBookingOutput>;
export const GetBookingOutput = z.object({
  status: z.union([z.literal("success"), z.literal("error")]),
  data: GetBookingData,
});

export type Response = z.infer<typeof Response>;
export const Response = z.object({
  name: z.string(),
  email: z.string(),
  guests: z.array(z.string()),
  location: z.union([Location, z.undefined()]).optional(),
  notes: z.union([z.string(), z.undefined()]).optional(),
});

export type CreateBookingInput = z.infer<typeof CreateBookingInput>;
export const CreateBookingInput = z.object({
  end: z.union([z.string(), z.undefined()]).optional(),
  start: z.string(),
  eventTypeId: z.number(),
  eventTypeSlug: z.union([z.string(), z.undefined()]).optional(),
  rescheduleUid: z.union([z.string(), z.undefined()]).optional(),
  recurringEventId: z.union([z.string(), z.undefined()]).optional(),
  timeZone: z.string(),
  user: z.union([z.array(z.string()), z.undefined()]).optional(),
  language: z.string(),
  bookingUid: z.union([z.string(), z.undefined()]).optional(),
  metadata: z.unknown(),
  hasHashedBookingLink: z.union([z.boolean(), z.undefined()]).optional(),
  hashedLink: z.union([z.string(), z.null()]),
  seatReferenceUid: z.union([z.string(), z.undefined()]).optional(),
  responses: Response,
  orgSlug: z.union([z.string(), z.undefined()]).optional(),
  locationUrl: z.union([z.string(), z.undefined()]).optional(),
});

export type CancelBookingInput = z.infer<typeof CancelBookingInput>;
export const CancelBookingInput = z.object({
  id: z.number(),
  uid: z.string(),
  allRemainingBookings: z.boolean(),
  cancellationReason: z.string(),
  seatReferenceUid: z.string(),
});

export type ReserveSlotInput = z.infer<typeof ReserveSlotInput>;
export const ReserveSlotInput = z.object({});

export type get_OAuthClientUsersController_getManagedUsers =
  typeof get_OAuthClientUsersController_getManagedUsers;
export const get_OAuthClientUsersController_getManagedUsers = {
  method: z.literal("GET"),
  path: z.literal("/v2/oauth-clients/{clientId}/users"),
  parameters: z.object({
    path: z.object({
      clientId: z.string(),
    }),
  }),
  response: GetManagedUsersOutput,
};

export type post_OAuthClientUsersController_createUser = typeof post_OAuthClientUsersController_createUser;
export const post_OAuthClientUsersController_createUser = {
  method: z.literal("POST"),
  path: z.literal("/v2/oauth-clients/{clientId}/users"),
  parameters: z.object({
    path: z.object({
      clientId: z.string(),
    }),
    body: CreateManagedUserInput,
  }),
  response: CreateManagedUserOutput,
};

export type get_OAuthClientUsersController_getUserById = typeof get_OAuthClientUsersController_getUserById;
export const get_OAuthClientUsersController_getUserById = {
  method: z.literal("GET"),
  path: z.literal("/v2/oauth-clients/{clientId}/users/{userId}"),
  parameters: z.object({
    path: z.object({
      clientId: z.string(),
      userId: z.number(),
    }),
  }),
  response: GetManagedUserOutput,
};

export type patch_OAuthClientUsersController_updateUser = typeof patch_OAuthClientUsersController_updateUser;
export const patch_OAuthClientUsersController_updateUser = {
  method: z.literal("PATCH"),
  path: z.literal("/v2/oauth-clients/{clientId}/users/{userId}"),
  parameters: z.object({
    path: z.object({
      clientId: z.string(),
      userId: z.number(),
    }),
    body: UpdateManagedUserInput,
  }),
  response: GetManagedUserOutput,
};

export type delete_OAuthClientUsersController_deleteUser =
  typeof delete_OAuthClientUsersController_deleteUser;
export const delete_OAuthClientUsersController_deleteUser = {
  method: z.literal("DELETE"),
  path: z.literal("/v2/oauth-clients/{clientId}/users/{userId}"),
  parameters: z.object({
    path: z.object({
      clientId: z.string(),
      userId: z.number(),
    }),
  }),
  response: GetManagedUserOutput,
};

export type post_OAuthClientUsersController_forceRefresh =
  typeof post_OAuthClientUsersController_forceRefresh;
export const post_OAuthClientUsersController_forceRefresh = {
  method: z.literal("POST"),
  path: z.literal("/v2/oauth-clients/{clientId}/users/{userId}/force-refresh"),
  parameters: z.object({
    path: z.object({
      userId: z.number(),
      clientId: z.string(),
    }),
  }),
  response: KeysResponseDto,
};

export type post_OAuthClientsController_createOAuthClient =
  typeof post_OAuthClientsController_createOAuthClient;
export const post_OAuthClientsController_createOAuthClient = {
  method: z.literal("POST"),
  path: z.literal("/v2/oauth-clients"),
  parameters: z.object({
    body: CreateOAuthClientInput,
  }),
  response: CreateOAuthClientResponseDto,
};

export type get_OAuthClientsController_getOAuthClients = typeof get_OAuthClientsController_getOAuthClients;
export const get_OAuthClientsController_getOAuthClients = {
  method: z.literal("GET"),
  path: z.literal("/v2/oauth-clients"),
  parameters: z.never(),
  response: GetOAuthClientsResponseDto,
};

export type get_OAuthClientsController_getOAuthClientById =
  typeof get_OAuthClientsController_getOAuthClientById;
export const get_OAuthClientsController_getOAuthClientById = {
  method: z.literal("GET"),
  path: z.literal("/v2/oauth-clients/{clientId}"),
  parameters: z.object({
    path: z.object({
      clientId: z.string(),
    }),
  }),
  response: GetOAuthClientResponseDto,
};

export type patch_OAuthClientsController_updateOAuthClient =
  typeof patch_OAuthClientsController_updateOAuthClient;
export const patch_OAuthClientsController_updateOAuthClient = {
  method: z.literal("PATCH"),
  path: z.literal("/v2/oauth-clients/{clientId}"),
  parameters: z.object({
    path: z.object({
      clientId: z.string(),
    }),
    body: UpdateOAuthClientInput,
  }),
  response: GetOAuthClientResponseDto,
};

export type delete_OAuthClientsController_deleteOAuthClient =
  typeof delete_OAuthClientsController_deleteOAuthClient;
export const delete_OAuthClientsController_deleteOAuthClient = {
  method: z.literal("DELETE"),
  path: z.literal("/v2/oauth-clients/{clientId}"),
  parameters: z.object({
    path: z.object({
      clientId: z.string(),
    }),
  }),
  response: GetOAuthClientResponseDto,
};

export type get_OAuthClientsController_getOAuthClientManagedUsersById =
  typeof get_OAuthClientsController_getOAuthClientManagedUsersById;
export const get_OAuthClientsController_getOAuthClientManagedUsersById = z.object({
  method: z.literal("GET"),
  path: z.literal("/v2/oauth-clients/{clientId}/managed-users"),
  parameters: z.object({
    path: z.object({
      clientId: z.string(),
    }),
  }),
  response: GetManagedUsersOutput,
});

export type post_OAuthFlowController_authorize = typeof post_OAuthFlowController_authorize;
export const post_OAuthFlowController_authorize = {
  method: z.literal("POST"),
  path: z.literal("/v2/oauth/{clientId}/authorize"),
  parameters: z.object({
    path: z.object({
      clientId: z.string(),
    }),
    body: OAuthAuthorizeInput,
  }),
  response: z.unknown(),
};

export type post_OAuthFlowController_exchange = typeof post_OAuthFlowController_exchange;
export const post_OAuthFlowController_exchange = {
  method: z.literal("POST"),
  path: z.literal("/v2/oauth/{clientId}/exchange"),
  parameters: z.object({
    path: z.object({
      clientId: z.string(),
    }),
    header: z.object({
      Authorization: z.string(),
    }),
    body: ExchangeAuthorizationCodeInput,
  }),
  response: KeysResponseDto,
};

export type post_OAuthFlowController_refreshAccessToken = typeof post_OAuthFlowController_refreshAccessToken;
export const post_OAuthFlowController_refreshAccessToken = {
  method: z.literal("POST"),
  path: z.literal("/v2/oauth/{clientId}/refresh"),
  parameters: z.object({
    path: z.object({
      clientId: z.string(),
    }),
    header: z.object({
      "x-cal-secret-key": z.string(),
    }),
    body: RefreshTokenInput,
  }),
  response: KeysResponseDto,
};

export type post_EventTypesController_createEventType = typeof post_EventTypesController_createEventType;
export const post_EventTypesController_createEventType = {
  method: z.literal("POST"),
  path: z.literal("/v2/event-types"),
  parameters: z.object({
    body: CreateEventTypeInput,
  }),
  response: CreateEventTypeOutput,
};

export type get_EventTypesController_getEventTypes = typeof get_EventTypesController_getEventTypes;
export const get_EventTypesController_getEventTypes = {
  method: z.literal("GET"),
  path: z.literal("/v2/event-types"),
  parameters: z.never(),
  response: GetEventTypesOutput,
};

export type get_EventTypesController_getEventType = typeof get_EventTypesController_getEventType;
export const get_EventTypesController_getEventType = {
  method: z.literal("GET"),
  path: z.literal("/v2/event-types/{eventTypeId}"),
  parameters: z.object({
    path: z.object({
      eventTypeId: z.string(),
    }),
  }),
  response: GetEventTypeOutput,
};

export type patch_EventTypesController_updateEventType = typeof patch_EventTypesController_updateEventType;
export const patch_EventTypesController_updateEventType = {
  method: z.literal("PATCH"),
  path: z.literal("/v2/event-types/{eventTypeId}"),
  parameters: z.object({
    path: z.object({
      eventTypeId: z.number(),
    }),
    body: UpdateEventTypeInput,
  }),
  response: UpdateEventTypeOutput,
};

export type delete_EventTypesController_deleteEventType = typeof delete_EventTypesController_deleteEventType;
export const delete_EventTypesController_deleteEventType = {
  method: z.literal("DELETE"),
  path: z.literal("/v2/event-types/{eventTypeId}"),
  parameters: z.object({
    path: z.object({
      eventTypeId: z.number(),
    }),
  }),
  response: DeleteEventTypeOutput,
};

export type get_EventTypesController_getPublicEventType = typeof get_EventTypesController_getPublicEventType;
export const get_EventTypesController_getPublicEventType = {
  method: z.literal("GET"),
  path: z.literal("/v2/event-types/{username}/{eventSlug}/public"),
  parameters: z.object({
    query: z.object({
      isTeamEvent: z.boolean().optional(),
      org: z.union([z.string(), z.null()]).optional(),
    }),
    path: z.object({
      username: z.string(),
      eventSlug: z.string(),
    }),
  }),
  response: GetEventTypePublicOutput,
};

export type get_EventTypesController_getPublicEventTypes =
  typeof get_EventTypesController_getPublicEventTypes;
export const get_EventTypesController_getPublicEventTypes = {
  method: z.literal("GET"),
  path: z.literal("/v2/event-types/{username}/public"),
  parameters: z.object({
    path: z.object({
      username: z.string(),
    }),
  }),
  response: GetEventTypesPublicOutput,
};

export type post_SchedulesController_createSchedule = typeof post_SchedulesController_createSchedule;
export const post_SchedulesController_createSchedule = {
  method: z.literal("POST"),
  path: z.literal("/v2/schedules"),
  parameters: z.object({
    body: CreateScheduleInput,
  }),
  response: CreateScheduleOutput,
};

export type get_SchedulesController_getSchedules = typeof get_SchedulesController_getSchedules;
export const get_SchedulesController_getSchedules = {
  method: z.literal("GET"),
  path: z.literal("/v2/schedules"),
  parameters: z.never(),
  response: GetSchedulesOutput,
};

export type get_SchedulesController_getDefaultSchedule = typeof get_SchedulesController_getDefaultSchedule;
export const get_SchedulesController_getDefaultSchedule = {
  method: z.literal("GET"),
  path: z.literal("/v2/schedules/default"),
  parameters: z.never(),
  response: GetDefaultScheduleOutput,
};

export type get_SchedulesController_getSchedule = typeof get_SchedulesController_getSchedule;
export const get_SchedulesController_getSchedule = {
  method: z.literal("GET"),
  path: z.literal("/v2/schedules/{scheduleId}"),
  parameters: z.object({
    path: z.object({
      scheduleId: z.number(),
    }),
  }),
  response: GetScheduleOutput,
};

export type patch_SchedulesController_updateSchedule = typeof patch_SchedulesController_updateSchedule;
export const patch_SchedulesController_updateSchedule = {
  method: z.literal("PATCH"),
  path: z.literal("/v2/schedules/{scheduleId}"),
  parameters: z.object({
    path: z.object({
      scheduleId: z.string(),
    }),
    body: UpdateScheduleInput,
  }),
  response: UpdateScheduleOutput,
};

export type delete_SchedulesController_deleteSchedule = typeof delete_SchedulesController_deleteSchedule;
export const delete_SchedulesController_deleteSchedule = {
  method: z.literal("DELETE"),
  path: z.literal("/v2/schedules/{scheduleId}"),
  parameters: z.object({
    path: z.object({
      scheduleId: z.number(),
    }),
  }),
  response: DeleteScheduleOutput,
};

export type get_BookingsController_getBookings = typeof get_BookingsController_getBookings;
export const get_BookingsController_getBookings = {
  method: z.literal("GET"),
  path: z.literal("/v2/bookings"),
  parameters: z.object({
    query: z.object({
      cursor: z.number(),
      limit: z.number(),
      "filters[status]": z.union([
        z.literal("upcoming"),
        z.literal("recurring"),
        z.literal("past"),
        z.literal("cancelled"),
        z.literal("unconfirmed"),
      ]),
    }),
  }),
  response: GetBookingsOutput,
};

export type post_BookingsController_createBooking = typeof post_BookingsController_createBooking;
export const post_BookingsController_createBooking = {
  method: z.literal("POST"),
  path: z.literal("/v2/bookings"),
  parameters: z.object({
    header: z.object({
      "x-cal-client-id": z.string(),
    }),
    body: CreateBookingInput,
  }),
  response: z.unknown(),
};

export type get_BookingsController_getBooking = typeof get_BookingsController_getBooking;
export const get_BookingsController_getBooking = {
  method: z.literal("GET"),
  path: z.literal("/v2/bookings/{bookingUid}"),
  parameters: z.object({
    path: z.object({
      bookingUid: z.string(),
    }),
  }),
  response: GetBookingOutput,
};

export type get_BookingsController_getBookingForReschedule =
  typeof get_BookingsController_getBookingForReschedule;
export const get_BookingsController_getBookingForReschedule = {
  method: z.literal("GET"),
  path: z.literal("/v2/bookings/{bookingUid}/reschedule"),
  parameters: z.object({
    path: z.object({
      bookingUid: z.string(),
    }),
  }),
  response: z.unknown(),
};

export type post_BookingsController_cancelBooking = typeof post_BookingsController_cancelBooking;
export const post_BookingsController_cancelBooking = {
  method: z.literal("POST"),
  path: z.literal("/v2/bookings/{bookingId}/cancel"),
  parameters: z.object({
    path: z.object({
      bookingId: z.string(),
    }),
    header: z.object({
      "x-cal-client-id": z.string(),
    }),
    body: CancelBookingInput,
  }),
  response: z.unknown(),
};

export type post_BookingsController_createRecurringBooking =
  typeof post_BookingsController_createRecurringBooking;
export const post_BookingsController_createRecurringBooking = {
  method: z.literal("POST"),
  path: z.literal("/v2/bookings/recurring"),
  parameters: z.object({
    header: z.object({
      "x-cal-client-id": z.string(),
    }),
    body: z.array(z.string()),
  }),
  response: z.unknown(),
};

export type post_BookingsController_createInstantBooking =
  typeof post_BookingsController_createInstantBooking;
export const post_BookingsController_createInstantBooking = {
  method: z.literal("POST"),
  path: z.literal("/v2/bookings/instant"),
  parameters: z.object({
    header: z.object({
      "x-cal-client-id": z.string(),
    }),
    body: CreateBookingInput,
  }),
  response: z.unknown(),
};

// <EndpointByMethod>
export const EndpointByMethod = {
  get: {
    "/v2/oauth-clients/{clientId}/users": get_OAuthClientUsersController_getManagedUsers,
    "/v2/oauth-clients/{clientId}/users/{userId}": get_OAuthClientUsersController_getUserById,
    "/v2/oauth-clients": get_OAuthClientsController_getOAuthClients,
    "/v2/oauth-clients/{clientId}": get_OAuthClientsController_getOAuthClientById,
    "/v2/oauth-clients/{clientId}/managed-users": get_OAuthClientsController_getOAuthClientManagedUsersById,
    "/v2/event-types": get_EventTypesController_getEventTypes,
    "/v2/event-types/{eventTypeId}": get_EventTypesController_getEventType,
    "/v2/event-types/{username}/{eventSlug}/public": get_EventTypesController_getPublicEventType,
    "/v2/event-types/{username}/public": get_EventTypesController_getPublicEventTypes,
    "/v2/schedules": get_SchedulesController_getSchedules,
    "/v2/schedules/default": get_SchedulesController_getDefaultSchedule,
    "/v2/schedules/{scheduleId}": get_SchedulesController_getSchedule,
    "/v2/bookings": get_BookingsController_getBookings,
    "/v2/bookings/{bookingUid}": get_BookingsController_getBooking,
    "/v2/bookings/{bookingUid}/reschedule": get_BookingsController_getBookingForReschedule,
  },
  post: {
    "/v2/oauth-clients/{clientId}/users": post_OAuthClientUsersController_createUser,
    "/v2/oauth-clients/{clientId}/users/{userId}/force-refresh": post_OAuthClientUsersController_forceRefresh,
    "/v2/oauth-clients": post_OAuthClientsController_createOAuthClient,
    "/v2/oauth/{clientId}/authorize": post_OAuthFlowController_authorize,
    "/v2/oauth/{clientId}/exchange": post_OAuthFlowController_exchange,
    "/v2/oauth/{clientId}/refresh": post_OAuthFlowController_refreshAccessToken,
    "/v2/event-types": post_EventTypesController_createEventType,
    "/v2/schedules": post_SchedulesController_createSchedule,
    "/v2/bookings": post_BookingsController_createBooking,
    "/v2/bookings/{bookingId}/cancel": post_BookingsController_cancelBooking,
    "/v2/bookings/recurring": post_BookingsController_createRecurringBooking,
    "/v2/bookings/instant": post_BookingsController_createInstantBooking,
  },
  patch: {
    "/v2/oauth-clients/{clientId}/users/{userId}": patch_OAuthClientUsersController_updateUser,
    "/v2/oauth-clients/{clientId}": patch_OAuthClientsController_updateOAuthClient,
    "/v2/event-types/{eventTypeId}": patch_EventTypesController_updateEventType,
    "/v2/schedules/{scheduleId}": patch_SchedulesController_updateSchedule,
  },
  delete: {
    "/v2/oauth-clients/{clientId}/users/{userId}": delete_OAuthClientUsersController_deleteUser,
    "/v2/oauth-clients/{clientId}": delete_OAuthClientsController_deleteOAuthClient,
    "/v2/event-types/{eventTypeId}": delete_EventTypesController_deleteEventType,
    "/v2/schedules/{scheduleId}": delete_SchedulesController_deleteSchedule,
  },
};
export type EndpointByMethod = typeof EndpointByMethod;
// </EndpointByMethod>

// <EndpointByMethod.Shorthands>
export type GetEndpoints = EndpointByMethod["get"];
export type PostEndpoints = EndpointByMethod["post"];
export type PatchEndpoints = EndpointByMethod["patch"];
export type DeleteEndpoints = EndpointByMethod["delete"];
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
    ...params: MaybeOptionalArg<z.infer<TEndpoint["parameters"]>>
  ): Promise<z.infer<TEndpoint["response"]>> {
    return this.fetcher("get", this.baseUrl + path, params[0]) as Promise<z.infer<TEndpoint["response"]>>;
  }
  // </ApiClient.get>

  // <ApiClient.post>
  post<Path extends keyof PostEndpoints, TEndpoint extends PostEndpoints[Path]>(
    path: Path,
    ...params: MaybeOptionalArg<z.infer<TEndpoint["parameters"]>>
  ): Promise<z.infer<TEndpoint["response"]>> {
    return this.fetcher("post", this.baseUrl + path, params[0]) as Promise<z.infer<TEndpoint["response"]>>;
  }
  // </ApiClient.post>

  // <ApiClient.patch>
  patch<Path extends keyof PatchEndpoints, TEndpoint extends PatchEndpoints[Path]>(
    path: Path,
    ...params: MaybeOptionalArg<z.infer<TEndpoint["parameters"]>>
  ): Promise<z.infer<TEndpoint["response"]>> {
    return this.fetcher("patch", this.baseUrl + path, params[0]) as Promise<z.infer<TEndpoint["response"]>>;
  }
  // </ApiClient.patch>

  // <ApiClient.delete>
  delete<Path extends keyof DeleteEndpoints, TEndpoint extends DeleteEndpoints[Path]>(
    path: Path,
    ...params: MaybeOptionalArg<z.infer<TEndpoint["parameters"]>>
  ): Promise<z.infer<TEndpoint["response"]>> {
    return this.fetcher("delete", this.baseUrl + path, params[0]) as Promise<z.infer<TEndpoint["response"]>>;
  }
  // </ApiClient.delete>
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

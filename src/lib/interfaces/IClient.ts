export interface IClient {
    authorize: () => Promise<void>
}
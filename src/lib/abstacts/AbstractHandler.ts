import { join, resolve } from 'node:path'
import { access, mkdir, readdir } from 'node:fs/promises'

export abstract class AbstractHandler<T> {
	protected readonly _path: string

	constructor (path: string) {
		this._path = path
	}

	public async createFolderIfNotExists (): Promise<true> {
		const isFolderExists = await access(this._path).then(() => true).catch(() => false)
		if (isFolderExists)
			return true

		return mkdir(this._path).then(() => true)
	}

	public async importFiles (): Promise<T[]> {
		const fileNames = await readdir(this._path).then((v: string[]): string[] => v.filter((v: string): boolean => v.endsWith('.js')))
		return Promise.all(
			fileNames.map(
				(v: string): Promise<T> =>
					import(resolve(join(this._path, v)))
						.then(({ default: data }): T => data)
			)
		)
	}
}
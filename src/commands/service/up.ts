import {flags} from '@oclif/command'

import {dryRunFlag} from '../../flags'
import DockerComposeCommand from '../../wrapper/docker-compose'
import {environmentFlag, servicesFlag} from '../../wrapper/docker-compose/flags'

export default class Up extends DockerComposeCommand {
  static description = 'build, (re)create, start, and attach to containers'

  static flags = {
    services: servicesFlag,
    environment: environmentFlag,
    'dry-run': dryRunFlag,
    help: flags.help({char: 'h'}),
  }

  async run() {
    const {flags} = this.parse(Up)
    const services = flags.services
    const environment = flags.environment
    const dryRun = flags['dry-run']

    try {
      this
        .dockerCompose(dryRun)
        .up({}, services, environment)
    } catch (e) {
      this.error(`${e.message}\nSee more help with --help`, e)
    }
  }
}
import {flags} from '@oclif/command'

import BaseCommand from '../base'

export default class Pull extends BaseCommand {
  static description = 'pull docker image(s) from registry'

  static flags = {
    ...BaseCommand.servicesEnvironmentsFlags,
    help: flags.help({char: 'h'}),
  }

  async run() {
    const {flags} = this.parse(Pull)
    const services = flags.service
    const environment = flags.environment

    this
      .dockerCompose()
      .pull({}, services, environment)
  }
}

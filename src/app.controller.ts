import { Controller, Get, NotFoundException, Param, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';

@Controller()
export class AppController {
  private readonly prismaService: PrismaService
  constructor(private readonly appService: AppService,
    prismaService:PrismaService
    ) {
      this.prismaService = prismaService;
    }

  @Get()
  @Render('index')
  index() {
    return { message: 'Welcome to the homepage' };
  }


  @Get('bills')
  listBills(){
    return this.prismaService.bills.findMany();
  }


  @Get('bills//id/:id')
  async oneBill(@Param('id') id: string){
    try{
      return await this.prismaService.bills.findFirstOrThrow({
        where:{
          id: parseInt(id)
        }
      })
    }catch{
      throw new NotFoundException('Nincs ilyen ID!')
    }
  }

  @Get('bills/type/:type')
  async oneType(@Param('type') type: string){
    try{
      return await this.prismaService.bills.findMany({
        where:{
          type: type
        }
      })
    }catch{
      throw new NotFoundException('Nincs ilyen számla')
    }
  }


  @Get('bills/urgent')
  async urgentList(){
    return await this.prismaService.bills.findFirst({
      orderBy:{
        due: 'asc'
      }
    })
  }

  @Get('bills/late')
  async lateList(){
    return await this.prismaService.bills.findMany({
      where: {
        due:{
          lt: new Date()
        }
        
      }
      
    })
  }


}

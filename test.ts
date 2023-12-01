import * as cheerio from "cheerio"
import fs from "fs"

function start() {
  let html = ""

  fs.readFile("./src/assets/response.txt", "utf-8", (err, data) => {
    html = data

    const $ = cheerio.load(html)

    const column = 7 * 6
    let row = 0
    const classroomName: any = []
    $("tbody tr td:first-child nobr").each((i, el) => {
      if (i == 39) console.log(123)
      const text = $(el)
        .text()
        .replace(/[\n\t]/g, "")

      classroomName.push(text)
      row++
    })

    // 获取教师课表空列表
    const classroomIsEmpty: boolean[] = []
    $("tbody tr td:not(:first-child) nobr").each((i, el) => {
      const text = $(el)
        .text()
        .replace(/[\n\t]/g, "")
        .trim()

      const isEmpty = text == "" ? true : false

      classroomIsEmpty.push(isEmpty)
    })

    // 每个教师1-7周 6节课是否有课
    const list: boolean[][] = []
    for (let i = 0; i < classroomIsEmpty.length; i += column) {
      list.push(classroomIsEmpty.slice(i, i + column))
    }

    // 转换为每一周的
    const res = []
    for (let i = 0; i < 7; i++) {
      const e = []
      for (let roomid = 0; roomid < list.length; roomid++) {
        const day = list[roomid].slice(i * 6, i * 6 + 6)
        e.push(day)
      }
      res.push(e)
    }

    const ans = []
    for (let i = 0; i < 7; i++) {
      const day_list = res[i]

      const day = []
      for (let col = 0; col < day_list[0].length; col++) {
        const jie = []
        for (let row = 0; row < day_list.length; row++) {
          jie.push(day_list[row][col])
        }
        day.push(jie)
      }

      ans.push(day)
    }
    // ans[0][0] -> 第一天的第一节课空教室情况
    // console.log(ans[0])

    const res_empty = []
    for (let i = 0; i < ans.length; i++) {
      const day = ans[i]
      const day_empty = []
      for (let jie = 0; jie < 6; jie++) {
        const jie_list = day[jie]
        const jie_empty = []
        for (let row = 0; row < jie_list.length; row++) {
          if (jie_list[row]) {
            jie_empty.push(classroomName[row])
          }
        }
        day_empty.push(jie_empty)
      }
      res_empty.push(day_empty)
    }

    console.log(res_empty)
  })
}

start()

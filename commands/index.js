// General commands
import menu from './general/menu.js';
import ping from './general/ping.js';
import alive from './general/alive.js';
import vv from './general/vv.js';
import deleteMsg from './general/delete.js';
import sticker from './general/sticker.js';
import jid from './general/jid.js';
import info from './general/info.js';
import checkowner from './general/checkowner.js';
import games from './general/games.js';
import ad from './general/ad.js';
import adit from './general/adit.js';
import setlang from './general/setlang.js';
import stats from './general/stats.js';
import updates from './general/updates.js';
import latest from './general/latest.js';
import adminhelp from './general/adminhelp.js';
import image from './general/image.js';
import orario from './general/orario.js';
import setorario from './general/setorario.js';
import testuntis from './general/testuntis.js';
import debugorario from './general/debugorario.js';
import teacher from './general/teacher.js';
import scam from './general/scam.js';
import ai from './general/ai.js';
import baida from './general/baida.js';
import trading from './general/trading.js';
import pay from './general/pay.js';
import daily from './general/daily.js';
import invite from './general/invite.js';
import leaderboard from './general/leaderboard.js';
import killstats from './general/killstats.js';
import shield from './general/shield.js';
import admin from './general/admin.js';
import test from './general/test.js';
import guide from './general/guide.js';
import stopguide from './general/stopguide.js';

// Game commands
import eightball from './games/8ball.js';
import dice from './games/dice.js';
import coinflip from './games/coinflip.js';
import rps from './games/rps.js';
import guess from './games/guess.js';
import trivia from './games/trivia.js';
import slot from './games/slot.js';
import math from './games/math.js';
import bank from './games/bank.js';
import tictactoe from './games/tictactoe.js';
import blackjack from './games/blackjack.js';
import hit from './games/hit.js';
import stand from './games/stand.js';
import double from './games/double.js';
import split from './games/split.js';
import insurance from './games/insurance.js';
import surrender from './games/surrender.js';
import bjstats from './games/bjstats.js';
import hand from './games/hand.js';
import bjleaderboard from './games/bjleaderboard.js';
import slotstats from './games/slotstats.js';
import shop from './games/shop.js';
import rob from './games/rob.js';
import fight from './games/fight.js';
import chess from './games/chess.js';
import roulette from './games/roulette.js';
import mines from './games/mines.js';
import buybulk from './games/buybulk.js';

// Downloader commands
import ytmp3 from './downloaders/ytmp3.js';

// Action commands
import kill from './action/kill.js';

// Admin commands
import add from './admin/add.js';
import ban from './admin/ban.js';
import kick from './admin/kick.js';
import promote from './admin/promote.js';
import demote from './admin/demote.js';
import mute from './admin/mute.js';
import unmute from './admin/unmute.js';
import tagall from './admin/tagall.js';
import tagnotadmin from './admin/tagnotadmin.js';
import tagadmin from './admin/tagadmin.js';
import hidetag from './admin/hidetag.js';
import antilink from './admin/antilink.js';
import welcome from './admin/welcome.js';
import setgname from './admin/setgname.js';
import setgdesc from './admin/setgdesc.js';
import resetlink from './admin/resetlink.js';
import groupinfo from './admin/groupinfo.js';
import staff from './admin/staff.js';
import warn from './admin/warn.js';
import warnings from './admin/warnings.js';
import delall from './admin/delall.js';
import lockdown from './admin/lockdown.js';
import antidelete from './admin/antidelete.js';
import report from './admin/report.js';
import newsletter from './admin/newsletter.js';

// Owner commands
import mode from './owner/mode.js';
import { botoff, boton } from './owner/botoff.js';
import spam from './owner/spam.js';
import broadcast from './owner/broadcast.js';
import debug from './owner/debug.js';
import autovv from './owner/autovv.js';
import autocall from './owner/autocall.js';
import raid from './owner/raid.js';
import addowner from './owner/addowner.js';
import removeowner from './owner/removeowner.js';
import listowners from './owner/listowners.js';
import manage from './owner/manage.js';
import newsletterconfig from './owner/newsletterconfig.js';
import checkbotjid from './owner/checkbotjid.js';
import addall from './owner/addall.js';
import roball from './owner/roball.js';
import ownerhelp from './owner/ownerhelp.js';
import announce from './owner/announce.js';
import resetbalances from './owner/resetbalances.js';

export const commands = {
    // General
    menu,
    help: menu, // Alias for backwards compatibility
    ping,
    alive,
    vv,
    delete: deleteMsg,
    del: deleteMsg,
    sticker,
    jid,
    info,
    checkowner,
    games,
    ad,
    adit,
    setlang,
    stats,
    updates,
    latest,
    adminhelp,
    admincommands: adminhelp, // Alias
    admincmd: adminhelp, // Alias
    image,
    toimage: image, // Alias
    img: image, // Alias
    orario,
    schedule: orario, // Alias
    timetable: orario, // Alias
    setorario,
    testuntis,
    debugorario,
    teacher,
    docente: teacher, // Alias
    prof: teacher, // Alias
    scam,
    truffa: scam, // Alias
    fraud: scam, // Alias
    fake: scam, // Alias
    ai,
    ask: ai, // Alias
    gpt: ai, // Alias
    chatgpt: ai, // Alias
    baida,
    dox: baida, // Alias
    search: baida, // Alias
    osint: baida, // Alias
    trading,
    trade: trading, // Alias
    stock: trading, // Alias
    pay,
    send: pay, // Alias
    transfer: pay, // Alias
    daily,
    claim: daily, // Alias
    reward: daily, // Alias
    invite,
    refer: invite, // Alias
    referral: invite, // Alias
    leaderboard,
    lb: leaderboard, // Alias
    top: leaderboard, // Alias
    rank: leaderboard, // Alias
    killstats,
    ks: killstats, // Alias
    killstat: killstats, // Alias
    shield,
    shld: shield, // Alias
    protection: shield, // Alias
    admin,
    adminlist: admin, // Alias
    admins: admin, // Alias
    test,
    guide,
    tutorial: guide, // Alias
    start: guide, // Alias
    stopguide,
    cancelguide: stopguide, // Alias
    skipguide: stopguide, // Alias
    
    // Downloaders
    ytmp3,
    song: ytmp3, // Alias
    play: ytmp3, // Alias
    music: ytmp3, // Alias
    
    // Games
    '8ball': eightball,
    dice,
    coinflip,
    coin: coinflip,
    rps,
    guess,
    trivia,
    slot,
    math,
    bank,
    tictactoe,
    ttt: tictactoe, // Alias
    blackjack,
    bj: blackjack, // Alias
    hit,
    stand,
    double,
    split,
    insurance,
    surrender,
    bjstats,
    blackjackstats: bjstats, // Alias
    hand,
    slotstats,
    slotstat: slotstats, // Alias
    ss: slotstats, // Alias
    bjtop: bjleaderboard,
    bjleaderboard: bjleaderboard, // Alias
    bjlb: bjleaderboard, // Alias
    shop,
    store: shop, // Alias
    rob,
    steal: rob, // Alias
    heist: rob, // Alias
    fight,
    defend: fight, // Alias
    counter: fight, // Alias
    chess,
    '♟️': chess, // Alias
    roulette,
    rlt: roulette, // Alias
    mines,
    mine: mines, // Alias
    minesweeper: mines, // Alias
    buybulk,
    bulkbuy: buybulk, // Alias
    buyweapons: buybulk, // Alias
    
    // Action
    kill,
    k: kill, // Alias
    
    // Admin
    add,
    ban,
    kick,
    promote,
    demote,
    mute,
    unmute,
    tagall,
    tagnotadmin,
    tagadmin,
    tagadmins: tagadmin, // Alias
    hidetag,
    antilink,
    welcome,
    setgname,
    setgdesc,
    resetlink,
    groupinfo,
    staff,
    stafflist: staff, // Alias
    warn,
    warnings,
    delall,
    lockdown,
    antidelete,
    report,
    newsletter,
    postnews: newsletter, // Alias
    newspost: newsletter, // Alias
    
    // Owner
    mode,
    botoff,
    boton,
    spam,
    broadcast,
    bc: broadcast,
    debug,
    autovv,
    autocall,
    raid,
    addowner,
    removeowner,
    listowners,
    manage,
    newsletterconfig,
    newsconfig: newsletterconfig, // Alias
    nconfig: newsletterconfig, // Alias
    checkbotjid,
    addall,
    roball,
    ownerhelp,
    ownercommands: ownerhelp, // Alias
    ownercmd: ownerhelp, // Alias
    announce,
    annuncio: announce, // Alias
    resetbalances,
    resetbal: resetbalances, // Alias
    economyreset: resetbalances, // Alias
};

{**
 * dungeon - floor
 *}
{include file='_header.tpl' skin='dungeon'}
    {Skin->h1 value="地下`$runner->now_floor`階"|half}

    <div style='text-align:center;'>
        <object data="{Html->convertURL url='/flash/dungeon/main.swf'}" type="application/x-shockwave-flash" width="{$Device->display_x}" height="{$Device->display_x}">
            <param name="bgcolor" value="000000" />
            <param name="loop" value="off" />
            <param name="quality" value="high" />
        </object>
    </div>
    {** 瀕死状態 **}
    {if $runner->isDying()}
        <div {Skin->getAttributes class='error2 center'}>
            <a href='#attention' style='color:#FFFFFF;'>HPが残りわずかです…!</a> 
        </div>
        <div style='text-align:right;'>
            {Html->a href='/mypage/bag/list' value="⇒`$config.game.phrase.bag`"|half}<br />
            {Html->a href='/shop/dungeon/items' value='⇒クロエの出張ショップ'|half}<br />
        </div>
    {/if}
    
    <div>
        <table style='width:100%;font-size:small;color:#FFFFFF;'>
            <tr>
                <td>　</td>
                <td align="center">
                    {if $runner->getMonsterPosition() & 1}
                        {Html->a href='/dungeon/floor?battle_cmd=fight' value='戦う'}
                    {elseif $around.front->enableMoveOn()}
                        {Html->a href='/dungeon/floor?choice_way='|cat:$runner->getDirection('front') value='前へ'}
                    {else}
                        {Skin->span value='前へ' class='link-unable'}
                    {/if}
                </td>
                <td>　</td>
            </tr>
            <tr>
                <td align="right">
                    {if $runner->getMonsterPosition()&1 && $around.left->enableMoveOn()}
                        {Html->a href='/dungeon/floor?battle_cmd=side_escape&choice_way='|cat:$runner->getDirection('left') value='左へ'}
                    {elseif $around.left->enableMoveOn()}
                        {Html->a href='/dungeon/floor?choice_way='|cat:$runner->getDirection('left') value='左へ'}
                    {else}
                        {Skin->span value='左へ' class='link-unable'}
                    {/if}
                </td>
                <td align="center">
                    {if $result->found_stairs}
                        {Html->a href="/dungeon/entrance" value="おりる"}
                    {elseif $result->treasurebox}
                        {Html->a href="/flash/dungeon/trusurebox.swf" value="あける"}
                    {elseif $around.front->enableMoveOn() && !$runner->getMonsterPosition() & 1}
                        {Html->a href='/dungeon/floor?dash=true&choice_way='|cat:$runner->getDirection('front') value='走る'}
                    {/if}
                </td>
                <td align="left">
                    {if $runner->getMonsterPosition()&1 && $around.right->enableMoveOn()}
                        {Html->a href='/dungeon/floor?battle_cmd=side_escape&choice_way='|cat:$runner->getDirection('right') value='右へ'}
                    {elseif $around.right->enableMoveOn()}
                        {Html->a href='/dungeon/floor?choice_way='|cat:$runner->getDirection('right') value='右へ'}
                    {else}
                        {Skin->span value='右へ' class='link-unable'}
                    {/if}
                </td>
            </tr>
            <tr>
                <td>&nbsp;</td>
                <td align="center">
                    {if $runner->getMonsterPosition()&1 && $runner->getMonsterPosition()!=3 && $around.back->enableMoveOn()}
                        {Html->a href='/dungeon/floor?battle_cmd=escape&choice_way='|cat:$runner->getDirection('back') value='後ろへ'}
                    {elseif $runner->getMonsterPosition()&2}
                        {Html->a href='/dungeon/floor?battle_cmd=turn' value='戦う'}
                    {elseif $around.back->enableMoveOn()}
                        {Html->a href='/dungeon/floor?choice_way='|cat:$runner->getDirection('back') value='後ろへ'}
                    {else}
                        {Skin->span value='後ろへ' class='link-unable'}
                    {/if}
                </td>
                <td>&nbsp;</td>
            </tr>
        </table>
    </div>
    {** キャラクタボイス **}
    {if $actor && $actor_words}
        {Skin->renderMessage character=$actor message=$actor_words}
    {/if}

    <div>
        {Skin->h2 value='ﾕｰｻﾞｰﾃﾞｰﾀ'}
        {Pict->level}Lv.{$runner->level} <img src='{$runner->getExpGuageURL()}' /><br />
        {Pict->money}{$config.game.phrase.money}　:{$Player->money}{$config.game.currency.name}<br />
        {Pict->attack_power}攻撃力:{$attack}<br />
        {Pict->defence_power}防御力:{$defence}<br />
    </div>

    <div>
        {Skin->h2 value='所持ｱｲﾃﾑ'}
        {foreach from=$items item='item' key='key'}
            <div {Skin->getLiAttributes key=$key}>
                ●{Html->a href="/mypage/bag/item/show?index=`$key`" value=$item->name|half}
                {if $item->type == $const.ITEM_TYPE_WEAPON}
                    ({$item->exp_point}/{$item->need_exp_point})
                {elseif $item->type == $const.ITEM_TYPE_ARMOR}
                    ({$item->exp_point}/{$item->need_exp_point})
                {/if}
                {if $item->equiped}
                    [E]
                {/if}
                {if $item->bag_amount > 1}
                    ({$item->bag_amount})
                {/if}
            </div>
        {foreachelse}
            <div {Skin->getLiAttributes key=0}>
                ｱｲﾃﾑを持っていません。
            </div>
        {/foreach}
    </div>
    
    
    <div>
        {Skin->h2 value='ﾕｰｻﾞｰﾒﾆｭｰ'}
        {Pict->shop} {Html->a href='/shop/dungeon/items' value='ｼｮｯﾌﾟ'}: ｸﾛｴの出張ｼｮｯﾌﾟ♪<br />
    </div>

{include file='_footer.tpl'}

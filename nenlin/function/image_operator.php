<?php

class ImageOperator
{
  private
    $include_path = '',
    $output_path  = '',
    $output_name  = 'hangar';

  private
    $side = 31;

  private
    $block_size = 10;


  public function __construct($params=array())
  {
    $this->include_path = dirname(dirname(__FILE__)).'/resource';
    $this->output_path  = dirname(dirname(__FILE__)).'/resource/output';

    foreach ($params as $key => $param) {
      if (isset($this->{$key})) {
        $this->{$key} = $param;
      }
    }
  }


  public function grow($data)
  {
    $width = $this->side*$this->block_size;
    $canvas = imagecreate($width, $width);
    $backg = imagecolorallocate($canvas, 255, 255, 255);

    $rows = str_split($data, $this->side);
    foreach ($rows as $r => $row) {
      $cells = str_split($row);
      foreach ($cells as $c => $cell) {
        if ($cell == 'n') {
          continue;
        }
        $lft = $c*$this->block_size;
        $top = $r*$this->block_size;
        $block = imagecreatefrompng("{$this->include_path}/{$cell}.png");
        imagecopy(
          $canvas, $block,
          $lft, $top,
          0, 0,
          $this->block_size, $this->block_size
        );
      }
    }

    imagepng($canvas, "{$this->output_path}/{$this->output_name}.png");
    imagedestroy($canvas);
  }
}


$ImageOperator = new ImageOperator(array(
  'include_path' => (isset($_POST['include_path'])) ? $_POST['include_path'] : '/home/zhen-xia/public_html/organism/nenlin/resource',
  'output_path'  => (isset($_POST['output_path']))  ? $_POST['output_path']  : '/home/zhen-xia/public_html/organism/nenlin/resource/output',
));

$ImageOperator->grow($_POST['conds']);

?>
